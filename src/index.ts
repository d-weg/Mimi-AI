import { api } from "@api";
import config from "@config";
import "@app";

api.listen({ host: config.api.BASE_URL, port: config.api.PORT });
