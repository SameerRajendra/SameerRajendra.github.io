// Module declaration for image assets imported directly in components (e.g.
// `import photo from './myphoto.jpg'`) so Vite fingerprints them at build time
// and TypeScript knows the import resolves to a string URL.
//
// Only added because no such declaration (and no vite/client types reference)
// existed anywhere in the project yet. Owned by the masthead/hero-chart agent
// per its task instructions; safe to extend with other extensions if needed.
declare module '*.jpg' {
    const src: string;
    export default src;
}
