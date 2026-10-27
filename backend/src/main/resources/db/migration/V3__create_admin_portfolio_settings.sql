CREATE TABLE admin_portfolio_settings (
                                          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

                                          admin_profile_id BIGINT NOT NULL UNIQUE,

                                          theme VARCHAR(10) NOT NULL DEFAULT 'LIGHT'
                                              CHECK (theme IN ('LIGHT', 'DARK')),

                                          accent_palette VARCHAR(30) NOT NULL DEFAULT 'MIDNIGHT_PARCHMENT',

                                          section_visibility JSONB NOT NULL DEFAULT '{}'::jsonb,

                                          section_order JSONB NOT NULL DEFAULT '[]'::jsonb,

                                          created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                          updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

                                          CONSTRAINT fk_portfolio_settings_admin_profile
                                              FOREIGN KEY (admin_profile_id)
                                                  REFERENCES admin_profile(id)
                                                  ON DELETE CASCADE
);