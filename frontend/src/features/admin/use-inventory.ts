"use client";

import { useEffect, useState } from "react";
import { errorMessage } from "@/lib/errors";
import { adminApi } from "@/services/admin-api";

export type Inventory = {
  profile: boolean;
  about: boolean;
  address: boolean;
  contact: boolean;
  skills: number;
  projects: number;
  experience: number;
  education: number;
  credentials: number;
  links: number;
  activities: number;
  resume: boolean;
  notes: string[];
};

const EMPTY: Inventory = {
  profile: false,
  about: false,
  address: false,
  contact: false,
  skills: 0,
  projects: 0,
  experience: 0,
  education: 0,
  credentials: 0,
  links: 0,
  activities: 0,
  resume: false,
  notes: [],
};

export function useAdminInventory(userName: string | undefined) {
  const [inventory, setInventory] = useState<Inventory>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userName) return;
    let active = true;
    Promise.allSettled([
      adminApi.getProfile(userName),
      adminApi.getSkills(userName),
      adminApi.listProjects(userName),
      adminApi.listExperience(userName),
      adminApi.listEducation(userName),
      adminApi.listCredentials(userName),
      adminApi.listLinks(userName),
      adminApi.listActivities(userName),
      adminApi.getContact(userName),
      adminApi.getResume(userName),
    ]).then((results) => {
      if (!active) return;
      const notes: string[] = [];
      const [profile, skills, projects, experience, education, credentials, links, activities, contact, resume] = results;
      results.forEach((result) => {
        if (result.status === "rejected") {
          const message = errorMessage(result.reason, "");
          if (message && !/not found/i.test(message) && !notes.includes(message)) notes.push(message);
        }
      });
      const skillCount = skills.status === "fulfilled"
        ? (skills.value.categories ?? []).reduce((total, category) => total + (category.skills?.length ?? 0), 0)
        : 0;
      setInventory({
        profile: profile.status === "fulfilled",
        about: profile.status === "fulfilled" && Boolean(profile.value.about?.trim()),
        address: profile.status === "fulfilled" && Boolean(profile.value.adminAddressResponseDTO),
        contact: contact.status === "fulfilled",
        skills: skillCount,
        projects: projects.status === "fulfilled" ? projects.value.length : 0,
        experience: experience.status === "fulfilled" ? experience.value.length : 0,
        education: education.status === "fulfilled" ? education.value.length : 0,
        credentials: credentials.status === "fulfilled" ? credentials.value.length : 0,
        links: links.status === "fulfilled" ? links.value.length : 0,
        activities: activities.status === "fulfilled" ? activities.value.length : 0,
        resume: resume.status === "fulfilled",
        notes,
      });
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [userName]);

  return { inventory, loading };
}
