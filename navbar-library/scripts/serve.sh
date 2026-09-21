#!/usr/bin/env bash
# Ensure the preview server is built and listening.
#
# Deliberately does NOT use `pgrep -f` to find the server: any shell command
# that merely MENTIONS the server's command line (for example a heredoc that
# writes this file) matches such a pattern, and the kill then takes out the
# calling shell instead. The PID is tracked in a file.
set -u
cd "$(dirname "$0")/.."
PORT="${PREVIEW_PORT:-4174}"
PIDFILE="logs/preview.pid"
URL="http://127.0.0.1:${PORT}/"

if curl -s -o /dev/null --max-time 3 --noproxy 127.0.0.1 "$URL"; then
  echo "preview: already up on ${PORT}"
  exit 0
fi

if [ -f "$PIDFILE" ]; then
  OLD="$(cat "$PIDFILE" 2>/dev/null || true)"
  if [ -n "$OLD" ] && kill -0 "$OLD" 2>/dev/null; then kill "$OLD" 2>/dev/null; sleep 1; fi
  rm -f "$PIDFILE"
fi

mkdir -p logs
setsid nohup npx vite preview --port "$PORT" --strictPort > logs/preview.log 2>&1 < /dev/null &
echo $! > "$PIDFILE"

for i in $(seq 1 25); do
  sleep 1
  if curl -s -o /dev/null --max-time 2 --noproxy 127.0.0.1 "$URL"; then
    echo "preview: up on ${PORT} after ${i}s"
    exit 0
  fi
done
echo "preview: FAILED to start"
tail -8 logs/preview.log
exit 1
