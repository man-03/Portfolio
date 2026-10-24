CREATE TABLE admin_contact_submission (
                                          id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                                          admin_profile_id BIGINT NOT NULL,
                                          name VARCHAR(100) NOT NULL,
                                          email VARCHAR(254) NOT NULL,
                                          message TEXT NOT NULL,
                                          submission_date DATE NOT NULL DEFAULT CURRENT_DATE,
                                          status VARCHAR(10) NOT NULL DEFAULT 'UNREAD'
                                              CHECK (status IN ('READ', 'UNREAD')),
                                          is_archived BOOLEAN NOT NULL DEFAULT FALSE,

                                          CONSTRAINT fk_contact_admin_profile
                                              FOREIGN KEY (admin_profile_id)
                                                  REFERENCES admin_profile(id)
                                                  ON DELETE CASCADE
);