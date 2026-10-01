# Example Plugin Rules

Behavioral guidelines and operating constraints for this plugin bundle. These rules are active whenever the plugin is enabled.

## Operating Principles
- **Modularity:** Keep skills, agents, and rules strictly scoped to the plugin's stated purpose.
- **Namespace Hygiene:** Prefix MCP server definitions and custom tools with the plugin ID to prevent global collisions.
- **Safety First:** Default automated tasks to sandboxed environments and avoid modifying files outside designated workspace targets.
