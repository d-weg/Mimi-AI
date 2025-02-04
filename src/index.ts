import { api } from "@api";
import config from "@config";

api.listen({ host: config.api.BASE_URL, port: config.api.PORT });
