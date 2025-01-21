import { Roles } from "./Roles";

export interface PublicRoute extends CustomRouteConfig {
  public: true;
}

export interface PrivateRoute extends CustomRouteConfig {
  public?: false;
  roles?: Array<keyof typeof Roles>;
}

export interface CustomRouteConfig {
  public?: boolean;
  roles?: Array<keyof typeof Roles>;
}
