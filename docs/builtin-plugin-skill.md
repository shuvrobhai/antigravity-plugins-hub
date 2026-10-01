# Antigravity Built-in Plugin Skill & Language Server RPC Reference

This document references the internal mechanisms of the Antigravity engine, filesystem discovery roots, and the Language Server Connect RPC endpoint.

---

## 1. Customization Roots & Discovery Hierarchy

Antigravity scans plugins and customizations across hierarchical discovery roots:

1. **Product Built-ins:**
   - Location: `/builtin/plugins/` (shipped with the product binary).
   - Behavior: Cannot be uninstalled (`DeletePlugin` rejected); can only be disabled.
2. **Global Customizations:**
   - Location: `~/.gemini/config/plugins/<name>/`
   - Scanned on startup; manifests evaluated at `plugin.json`.
3. **Workspace Customizations:**
   - Location: `.agents/plugins/<name>/`
   - Active only within the opened workspace session.

---

## 2. Language Server Connect RPC Service

The Antigravity engine runs an internal Language Server exposing a Connect endpoint.

### Environment Variables
* `ANTIGRAVITY_LS_ADDRESS`: Defaults to `localhost:5387`.
* `ANTIGRAVITY_CSRF_TOKEN`: Required header `x-codeium-csrf-token`.

### RPC Helper Script
```bash
lsrpc() {  # usage: lsrpc <MethodName> <json-body>
  curl -sS -X POST \
    "http://${ANTIGRAVITY_LS_ADDRESS}/exa.language_server_pb.LanguageServerService/$1" \
    -H "Content-Type: application/json" \
    -H "x-codeium-csrf-token: ${ANTIGRAVITY_CSRF_TOKEN}" \
    -d "$2"
}
```

### Key RPC Methods

1. **`GetAllPlugins`**
   Retrieves active plugins and inlines all skills, agents, rules, hooks, and MCP servers.
   ```bash
   lsrpc GetAllPlugins '{}' | jq '[.plugins[] | {name, dir: (.path | split("/") | last), disabled}]'
   ```
2. **`JetboxWriteState`**
   Deep-merges configuration state live without requiring an IDE restart.
   ```bash
   # Enable plugin:
   lsrpc JetboxWriteState '{"userConfig":{"plugins":{"<dir>":{"enabled":true}}}}'

   # Disable plugin:
   lsrpc JetboxWriteState '{"userConfig":{"plugins":{"<dir>":{"enabled":false}}}}'
   ```
3. **`DeletePlugin`**
   Uninstalls a user plugin by directory ID.
   ```bash
   lsrpc DeletePlugin '{"pluginId":"<dir>"}'
   ```
4. **`InstallCustomization`**
   Installs a package directly by Marketplace catalog ID.
   ```bash
   lsrpc InstallCustomization '{"id":"<marketplace-id>"}'
   ```

---

## 3. Operational Invariants

* **Direct Editing of `config.json`:** Never manually edit `~/.gemini/config/config.json`. The file is managed atomically at mode `0600`; manual modifications bypass live sidecar reloads and can corrupt sibling configuration keys.
* **Directory Discovery vs. Live State:** Directory scans happen on startup. New directories require a restart; enabling/disabling is live via RPC.
