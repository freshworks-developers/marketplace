#!/usr/bin/env bash
# Mock claude CLI for installer tests. Tracks plugins in $HOME/.mock-claude-plugins.
set -euo pipefail

STATE="${HOME}/.mock-claude-plugins"
VERSION="${FW_TEST_PLUGIN_VERSION:-1.1.4}"

init_state() {
  if [[ ! -f "$STATE" ]]; then
    echo '[]' > "$STATE"
  fi
}

list_plugins() {
  init_state
  node -e "
    const plugins = JSON.parse(require('fs').readFileSync('$STATE', 'utf8'));
    for (const p of plugins) console.log(p.name + '@freshworks-dev-tools ' + p.version);
  "
}

add_plugin() {
  local name="$1"
  init_state
  node -e "
    const fs = require('fs');
    const state = '$STATE';
    const plugins = JSON.parse(fs.readFileSync(state, 'utf8'));
    if (!plugins.find(p => p.name === '$name')) {
      plugins.push({ name: '$name', version: '$VERSION' });
      fs.writeFileSync(state, JSON.stringify(plugins));
    }
  "
}

remove_plugin() {
  local name="$1"
  init_state
  node -e "
    const fs = require('fs');
    const state = '$STATE';
    let plugins = JSON.parse(fs.readFileSync(state, 'utf8'));
    plugins = plugins.filter(p => p.name !== '$name');
    fs.writeFileSync(state, JSON.stringify(plugins));
  "
}

cmd="${1:-}"
shift || true

case "$cmd" in
  plugin)
    sub="${1:-}"
    shift || true
    case "$sub" in
      marketplace)
        action="${1:-}"
        shift || true
        [[ "$action" == "add" ]] && exit 0
        exit 0
        ;;
      install)
        name="${1%%@*}"
        add_plugin "$name"
        exit 0
        ;;
      uninstall)
        name="${1%%@*}"
        remove_plugin "$name"
        exit 0
        ;;
      list)
        list_plugins
        exit 0
        ;;
    esac
    ;;
esac

echo "mock-claude: unhandled: $cmd $*" >&2
exit 1
