"use client";

import { useEffect, useState } from "react";
import { Button, TextField } from "@/components/ui/controls";
import { ConfirmDialog } from "@/components/ui/dialog";
import { EmptyState, ErrorState, FormBanner, LoadingBlock } from "@/components/ui/feedback";
import { useSession } from "@/hooks/use-session";
import { useToast } from "@/hooks/use-toast";
import { errorMessage } from "@/lib/errors";
import { adminApi } from "@/services/admin-api";
import type { SkillsRequest } from "@/types/portfolio";

type DraftSkill = { key: string; id?: number; skill: string };
type DraftCategory = { key: string; id?: number; category: string; skills: DraftSkill[] };

function newKey() {
  return crypto.randomUUID();
}

function emptyCategory(): DraftCategory {
  return { key: newKey(), category: "", skills: [{ key: newKey(), skill: "" }] };
}

export function SkillsView() {
  const session = useSession();
  const toast = useToast();
  const [categories, setCategories] = useState<DraftCategory[]>([]);
  const [mode, setMode] = useState<"create" | "update">("create");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!session) return;
    let active = true;
    adminApi
      .getSkills(session.userName)
      .then((skills) => {
        if (!active) return;
        const next = (skills.categories ?? []).map((category) => ({
          key: newKey(),
          id: category.id,
          category: category.category ?? "",
          skills: (category.skills ?? []).map((skill) => ({
            key: newKey(),
            id: skill.id,
            skill: skill.skill ?? "",
          })),
        }));
        setCategories(next);
        setMode(next.length ? "update" : "create");
        setStatus("ready");
      })
      .catch((caught) => {
        if (!active) return;
        setStatus("error");
        setError(errorMessage(caught, "Skills could not be loaded."));
      });
    return () => {
      active = false;
    };
  }, [session, reloadKey]);

  if (!session) return null;

  function payload(): SkillsRequest {
    return {
      categories: categories.map((category) => ({
        id: category.id,
        category: category.category.trim(),
        skills: category.skills
          .filter((skill) => skill.skill.trim())
          .map((skill) => ({ id: skill.id, skill: skill.skill.trim() })),
      })),
    };
  }

  function validate() {
    if (categories.some((category) => !category.category.trim())) {
      return "Every category needs a name.";
    }
    if (categories.some((category) => category.skills.every((skill) => !skill.skill.trim()))) {
      return "Every category needs at least one skill.";
    }
    return null;
  }

  async function save(nextMode = mode) {
    if (!session) return;
    const validation = categories.length ? validate() : null;
    if (validation) {
      setFormError(validation);
      return;
    }
    if (!categories.length && nextMode === "create") {
      setFormError("Add a category before saving.");
      return;
    }
    setPending(true);
    setFormError(null);
    try {
      const body = payload();
      const saved = nextMode === "create"
        ? await adminApi.createSkills(session.userName, body)
        : await adminApi.updateSkills(session.userName, body);
      const next = (saved.categories ?? []).map((category) => ({
        key: newKey(),
        id: category.id,
        category: category.category ?? "",
        skills: (category.skills ?? []).map((skill) => ({ key: newKey(), id: skill.id, skill: skill.skill ?? "" })),
      }));
      setCategories(next);
      setMode(next.length ? "update" : "create");
      setConfirmClear(false);
      toast.success("Skills saved.");
    } catch (caught) {
      setFormError(errorMessage(caught, "Skills could not be saved."));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="stack">
      <header className="page-intro spread">
        <div>
          <h1>Skills</h1>
          <p>Categories and skills are saved together. Removing a category here deletes it on the next save.</p>
        </div>
        <Button onClick={() => setCategories((current) => [...current, emptyCategory()])}>Add category</Button>
      </header>
      {status === "loading" ? <LoadingBlock label="Loading skills" /> : null}
      {status === "error" ? <ErrorState message={error ?? "Skills could not be loaded."} onRetry={() => { setStatus("loading"); setReloadKey((value) => value + 1); }} /> : null}
      {status === "ready" ? (
        <>
          <FormBanner message={formError} />
          {categories.length === 0 ? (
            <EmptyState title="No skill categories yet" description="Add a category to show skills on the portfolio." />
          ) : (
            <div className="skill-editor">
              {categories.map((category, categoryIndex) => (
                <article key={category.key} className="panel clay stack">
                  <TextField
                    id={`category-${category.key}`}
                    label="Category"
                    value={category.category}
                    onChange={(value) =>
                      setCategories((current) =>
                        current.map((item, index) => (index === categoryIndex ? { ...item, category: value } : item)),
                      )
                    }
                    required
                  />
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.key} className="skill-line">
                      <TextField
                        id={`skill-${skill.key}`}
                        label={skillIndex === 0 ? "Skill" : `Skill ${skillIndex + 1}`}
                        value={skill.skill}
                        onChange={(value) =>
                          setCategories((current) =>
                            current.map((item, index) =>
                              index === categoryIndex
                                ? {
                                    ...item,
                                    skills: item.skills.map((entry, entryIndex) =>
                                      entryIndex === skillIndex ? { ...entry, skill: value } : entry,
                                    ),
                                  }
                                : item,
                            ),
                          )
                        }
                      />
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setCategories((current) =>
                            current.map((item, index) =>
                              index === categoryIndex
                                ? { ...item, skills: item.skills.filter((entry) => entry.key !== skill.key) }
                                : item,
                            ),
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <div className="row">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setCategories((current) =>
                          current.map((item, index) =>
                            index === categoryIndex ? { ...item, skills: [...item.skills, { key: newKey(), skill: "" }] } : item,
                          ),
                        )
                      }
                    >
                      Add skill
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setCategories((current) => current.filter((item) => item.key !== category.key))}
                    >
                      Remove category
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="row">
            <Button
              onClick={() => {
                if (!categories.length && mode === "update") {
                  setConfirmClear(true);
                  return;
                }
                void save();
              }}
              disabled={pending}
            >
              {pending ? "Saving..." : "Save skills"}
            </Button>
          </div>
        </>
      ) : null}
      <ConfirmDialog
        open={confirmClear}
        title="Remove all skills?"
        description="Saving an empty list removes every skill category from the portfolio."
        confirmLabel="Remove skills"
        pending={pending}
        onConfirm={() => void save("update")}
        onClose={() => {
          if (!pending) setConfirmClear(false);
        }}
      />
    </section>
  );
}
