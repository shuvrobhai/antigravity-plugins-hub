#!/usr/bin/env node
// Minimal, dependency-free MCP (Model Context Protocol) stdio server stub.
//
// Serves a single `echo` tool so that scaffolding from templates/default-bundle
// produces a bundle that actually launches. Replace the tool definition below
// with your real implementation, or delete this file and the corresponding
// entry in ../mcp_config.json if you do not need an MCP server.
//
// Protocol: newline-delimited JSON-RPC 2.0 over stdin/stdout. Logging must go
// to stderr -- anything on stdout is parsed as protocol traffic.

const SERVER_INFO = { name: "example-plugin-helper", version: "0.1.0" };
const PROTOCOL_VERSION = "2024-11-05";

const TOOLS = [
  {
    name: "echo",
    description: "Echo a message back to the caller. Stub tool for template scaffolding.",
    inputSchema: {
      type: "object",
      properties: {
        message: { type: "string", description: "Text to echo back." },
      },
      required: ["message"],
    },
  },
];

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

function reply(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function replyError(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

function handle(msg) {
  const { id, method, params } = msg;

  // Notifications carry no id and expect no response.
  const isNotification = id === undefined || id === null;

  switch (method) {
    case "initialize":
      reply(id, {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      });
      return;

    case "notifications/initialized":
    case "initialized":
      return;

    case "ping":
      if (!isNotification) reply(id, {});
      return;

    case "tools/list":
      reply(id, { tools: TOOLS });
      return;

    case "tools/call": {
      const toolName = params && params.name;
      if (toolName !== "echo") {
        replyError(id, -32602, `Unknown tool: ${toolName}`);
        return;
      }
      const args = (params && params.arguments) || {};
      if (typeof args.message !== "string") {
        replyError(id, -32602, "Missing required string argument: message");
        return;
      }
      reply(id, { content: [{ type: "text", text: args.message }] });
      return;
    }

    default:
      if (isNotification) return;
      // -32601 = method not found.
      replyError(id, -32601, `Method not found: ${method}`);
  }
}

let buffer = "";

process.stdin.on("data", (chunk) => {
  buffer += chunk.toString();

  let newlineIndex;
  while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
    const line = buffer.slice(0, newlineIndex).trim();
    buffer = buffer.slice(newlineIndex + 1);
    if (!line) continue;

    let msg;
    try {
      msg = JSON.parse(line);
    } catch (err) {
      // -32700 = parse error.
      send({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
      continue;
    }

    try {
      handle(msg);
    } catch (err) {
      if (msg && msg.id !== undefined && msg.id !== null) {
        replyError(msg.id, -32603, "Internal error: " + err.message);
      }
    }
  }
});

process.stdin.on("end", () => process.exit(0));