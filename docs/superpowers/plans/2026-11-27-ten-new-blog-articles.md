# Diez nuevos artículos del blog — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (recommended) or superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear, maquetar y publicar diez artículos nuevos —cinco para Pyme360 y cinco para alojamientos rurales— con imágenes destacadas optimizadas y CTA coherentes.

**Architecture:** Cada artículo tendrá una fuente Markdown en `articulos/borradores/`, una página HTML idéntica en `blog/<slug>/index.html` y `public/blog/<slug>/index.html`, una imagen destacada local en `assets/blog/` y `public/assets/blog/`, y una tarjeta en ambos índices del blog. Los artículos rurales enlazarán a `https://pyme360.online/alojamientos-rurales/`; solo los artículos que traten precios, rentabilidad o revenue enlazarán al formulario de Home4Escape.

**Tech Stack:** HTML estático, Markdown editorial, JSON-LD `BlogPosting`/`FAQPage`, WebP/JPG, CSS existente de Pyme360, Node.js tests y GitHub `main` con despliegue Hostinger.

---

### Task 1: Preparar el lote editorial

**Files:**
- Create: `articulos/borradores/2026-11-27-*.md`
- Modify: `articulos/briefs/2026-11-26-next-content-briefs.md`
- Modify: `checklist.md`

- [ ] **Step 1: Crear los diez borradores con fuente, intención, CTA y FAQ**

Crear estos slugs y títulos: `perfil-google-business-optimizado`, `mas-llamadas-google-maps`, `reservas-directas-sin-booking`, `precio-minimo-rentable-casa-rural`, `google-ads-o-meta-ads`, `ficha-google-suspendida`, `google-vacation-rentals-alojamientos`, `email-marketing-negocios-locales`, `abrir-casa-rural-visibilidad-digital`, `motor-reservas-channel-manager`.

- [ ] **Step 2: Aplicar la regla de CTA**

Usar `https://pyme360.online/alojamientos-rurales/` en los artículos rurales. Usar `https://www.home4escape.com/contactar/` solo en el artículo de precio mínimo rentable, con UTM específica y el aviso «El revenue management lo presta Home4Escape, no Pyme360».

- [ ] **Step 3: Ejecutar control editorial**

Comprobar que cada artículo tiene respuesta directa inicial, 4–6 H2, tres FAQ, enlaces internos, ninguna cifra sin fuente primaria y una indicación de imagen destacada.

### Task 2: Crear las imágenes destacadas

**Files:**
- Create: `assets/blog/nuevos-*.webp`
- Create: `assets/blog/nuevos-*.jpg`
- Mirror: `public/assets/blog/nuevos-*.webp`
- Mirror: `public/assets/blog/nuevos-*.jpg`

- [ ] **Step 1: Generar diez imágenes editoriales**

Generar una imagen por artículo, sin texto incrustado, logos ni capturas falsas de Google, Airbnb o Meta. Composición horizontal editorial, usable como hero y tarjeta.

- [ ] **Step 2: Optimizar y nombrar los assets**

Usar nombres descriptivos, WebP para la tarjeta y JPG como fallback/OG. Comprobar dimensiones, peso razonable, `alt` descriptivo y paridad entre `assets/blog/` y `public/assets/blog/`.

### Task 3: Maquetar los diez artículos

**Files:**
- Create: `blog/<slug>/index.html`
- Create: `public/blog/<slug>/index.html`

- [ ] **Step 1: Aplicar la plantilla editorial existente**

Mantener navegación, footer, autor Theo Rubio, una sola H1, breadcrumb, `BlogPosting`, `BreadcrumbList`, `FAQPage`, imagen hero y CTA final.

- [ ] **Step 2: Añadir metadatos y enlaces internos**

Crear canonical, title descriptivo, meta description, `og:image`, Twitter image y Schema con la imagen correspondiente. Enlazar entre artículos y páginas de servicio sin crear URLs nuevas de servicio.

- [ ] **Step 3: Verificar paridad raíz/public**

Comparar byte a byte cada HTML y validar que no se haya alterado ningún artículo ajeno.

### Task 4: Integrar el índice y señales SEO

**Files:**
- Modify: `blog/index.html`
- Modify: `public/blog/index.html`
- Modify: `sitemap.xml`
- Modify: `public/sitemap.xml`
- Modify: `llms.txt`
- Modify: `public/llms.txt`
- Modify: `tests/blog-articles.test.cjs`

- [ ] **Step 1: Añadir diez tarjetas al índice**

Cada tarjeta debe usar la imagen WebP, título, categoría, tiempo estimado, resumen y enlace al slug correcto.

- [ ] **Step 2: Añadir URLs al sitemap y llms**

Usar fecha `2026-11-27` y no añadir URLs de borrador.

- [ ] **Step 3: Ampliar los tests de artículos**

Incluir los diez slugs, comprobar existencia, paridad, canonical, una sola H1, autor, JSON-LD válido e imagen hero.

### Task 5: Verificar y publicar

- [ ] **Step 1: Ejecutar la batería**

Ejecutar `node tests/blog.test.cjs`, `node tests/blog-articles.test.cjs`, `node tests/revenue-cta.test.cjs`, `node tests/asset-cache.test.cjs` y `git diff --check`.

- [ ] **Step 2: Revisar las URLs localmente**

Servir el proyecto en local y comprobar visualmente portada, una página Pyme360, una rural, una de revenue y las imágenes en móvil/escritorio.

- [ ] **Step 3: Commit y push**

Subir solo los archivos de este lote a `main`, dejando fuera `precios.html`, `CLAUDE.md`, assets de otros proyectos y cualquier cambio ajeno.

- [ ] **Step 4: Verificar producción**

Comprobar HTTP 200, CTA rural, CTA Home4Escape, imagen hero y título en las diez URLs después del despliegue.
