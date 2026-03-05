#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    [ "$HUSKY_DEBUG" = "1" ] && echo "husky (debug) - $1"
  }

  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ ! -f package.json ]; then
    debug "package.json not found, skipping hook"
    exit 0
  fi

  command_exists () {
    command -v "$1" >/dev/null 2>&1
  }

  husky_exec () {
    local cmd="$1"
    shift
    if command_exists npx; then
      npx --no-install "$cmd" "$@"
    elif command_exists pnpm; then
      pnpm exec "$cmd" "$@"
    elif command_exists yarn; then
      yarn exec "$cmd" "$@"
    else
      echo "husky - cannot find package manager to run $cmd"
      exit 1
    fi
  }

  debug "Running hook $hook_name"
fi

