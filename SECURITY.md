# Security policy

LabSuite Music intentionally has no automatic update channel. Build provenance
is part of the security boundary: use a pinned source revision, run
`yarn verify:security`, and verify the packaged artifact hash before release.

Do not include Google cookies, authorization tokens, account identifiers, or
complete logs in a security report. The Companion API token can be revoked from
Settings > Integrations > Authorized companions.

Until a LabSuite signing certificate is configured, local builds are unsigned
developer artifacts and should not be redistributed as production installers.
