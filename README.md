# Artisan Migration

Estoy migrando una página ya diseñada en Claude/Fable a Lovable. No quiero rediseñar desde cero: quiero que repliques fielmente la estructura, estilo visual, layouts, páginas y lógica con base en los archivos que estoy subiendo.

Usa los archivos HTML como referencia principal de diseño y estructura:

- Home

- Categoría

- Producto Maráica

- Producto Mini Maráica

- Arma tu Taluna

Usa los archivos CSS y JS para conservar estilos, interacciones, datos de productos y lógica visual.

IMPORTANTE:

Por ahora no estoy subiendo todos los assets porque son demasiados. Usa placeholders temporales donde falten imágenes, pero respeta exactamente los espacios, proporciones, fondos y estructura visual.

Después subiré las imágenes reales una por una para reemplazar placeholders.

Reglas de ecommerce:

- Las bolsas NO se pueden comprar solas.

- En cada página de producto de bolsa, la clienta debe elegir obligatoriamente un strap antes de agregar al carrito.

- Los straps SÍ se pueden vender solos desde su propia colección.

- No crear productos separados por cada combinación bolsa + strap.

- La combinación se arma dinámicamente: bolsa seleccionada + color + strap seleccionado + total actualizado.

Estilo visual:

- Mobile-first.

- Premium, limpio, cálido, artesanal y editorial.

- Mantener fondos ivory/beige claros.

- Las cards de productos y straps deben tener el mismo fondo visual que el apartado “Más vendidos”.

- No cambiar tipografías, espaciados, botones, header, cards ni estructura general salvo que sea necesario para hacerlo funcional.

Objetivo:

Recrear esta página en Lovable de forma funcional, limpia y editable, manteniendo lo más fiel posible el diseño original.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://artisanal-style-migrator.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6de4c42a-049f-4f2e-98c4-fa02dc713f97).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
