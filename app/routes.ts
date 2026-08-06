import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
  route("login", "routes/login.tsx"),
  layout("routes/admin-layout.tsx", [
    index("routes/dashboard.tsx"),
    route("families", "routes/families.tsx"),
    route("families/:familyId", "routes/family-detail.tsx"),
    route("rsvps", "routes/rsvps.tsx"),
    route("rsvp-managers", "routes/rsvp-managers.tsx"),
    route("wishes", "routes/wishes.tsx"),
    route("carousel", "routes/carousel.tsx"),
    route("faq", "routes/faq.tsx"),
  ]),
  route("manager/login", "routes/manager-login.tsx"),
  layout("routes/manager-layout.tsx", [
    route("manager", "routes/manager-dashboard.tsx"),
  ]),
] satisfies RouteConfig;
