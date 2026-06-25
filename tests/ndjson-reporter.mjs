// Custom test reporter — outputs one NDJSON line per pass/fail event.
// Used by run-all-tests.sh to capture structured results for all-tests-report.js.
export default async function* (source) {
  for await (const event of source) {
    if (event.type === 'test:pass' || event.type === 'test:fail') {
      const file = event.data.file
        ? event.data.file.replace(/^file:\/\//, '').split('/').pop()
        : null;
      yield JSON.stringify({ ...event, _file: file }) + '\n';
    }
  }
}
