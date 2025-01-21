import { app } from "./app";
import env from "./env";

if (env.IS_LOCAL) app.listen({ port: env.PORT || 3000 });
else app.listen({ host: "0.0.0.0", port: env.PORT });
