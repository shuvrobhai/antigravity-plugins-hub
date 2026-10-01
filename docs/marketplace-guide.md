# Antigravity Marketplace & Distribution Guide

This guide covers plugin discovery, installation mechanisms, cross-surface synchronization, and distribution paths for Google Antigravity.

---

## 1. Discovery & The Marketplace Tab

Plugins are distributed and discovered via the **Customizations** panel:

1. Open the left sidebar in Antigravity and click **Customizations** (or the `…` menu in the agent pane).
2. Navigate to the **Marketplace** tab.
3. Browse curated collections or search by keyword (matched against the `description` field in `plugin.json`).
4. Click **+** on any card to trigger installation.

---

## 2. Installation Mechanics

### In-App Installation
When installed from the Marketplace:
* The bundle is extracted to `~/.gemini/config/plugins/<hash>/`.
* The folder name is a signed 64-bit integer hash (e.g. `-1870732469773246571`).
* This directory name (`dir`) becomes the operational key for all lifecycle management actions.

### CLI Installation
Plugins can be installed from the command line:

```bash
# From Marketplace:
agy plugin install <plugin-name>@<marketplace-name>

# From local directory:
agy plugin install ./plugins/my-plugin
```

Slash command alternative in chat:
```text
/plugin install <path-or-marketplace-id>
```

---

## 3. Local Development & Symlink Workflows

For local testing without publishing:

```bash
# Workspace level
mkdir -p .agents/plugins
ln -sfn $(pwd)/plugins/my-plugin .agents/plugins/my-plugin

# Global level
ln -sfn $(pwd)/plugins/my-plugin ~/.gemini/config/plugins/my-plugin
```

> **Discovery Note:** Symlinked plugins are discovered upon application restart. After restart, they appear in the UI Customizations tab and can be toggled live.

---

## 4. Cross-Surface Synchronization

When working across multiple workstations:
* Workspace-level plugins (`.agents/plugins/`) committed to a shared Git repository are immediately active for all team members opening the repository.
* Avoid committing private credentials, API tokens, or secrets inside `mcp_config.json`; use environment variable references (`${VAR_NAME}`) instead.
