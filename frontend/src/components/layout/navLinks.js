export const navLinks = [
  { to: "/", label: "Home", requiresAuth: false },
  { to: "/restaurants", label: "Restaurants", requiresAuth: false },
  { to: "/orders", label: "My Orders", requiresAuth: true },
];

export const getVisibleLinks = (user) =>
  navLinks.filter((l) => !l.requiresAuth || !!user);