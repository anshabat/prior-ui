/*
  - We are using nav->ol for better accessibility. The order of nav links matter, so we are using ordered list
  - Use are using aria-current="page" for last breadcrumb item to indicate current page for accessibility.
    We could use aria-current="true" but "page" is more specific that it is current page, not just current.
    Better for screen readers, voice will tell "current page", not just "current"
*/
export const Breadcrumbs = () => {
  return (
    <nav aria-label="Breadcrumbs">
      <ol>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/category">Category</a>
        </li>
        <li aria-current="page">Current Page</li>
      </ol>
    </nav>
  );
};
