import { gatewayApi } from "@/lib/config/api.config";
import type {
    Command,
    CommandWithItems,
    CreateCommandInput,
    UpdateCommandInput,
    CommandQueryParams,
} from "@good-food-maalsi/contracts/franchise";

const baseURL = "/franchise/commands";

export const commandService = {
    async findAll(params: CommandQueryParams = {}) {
        const { data } = await gatewayApi.get(baseURL, { params });
        return data;
    },

    async findById(id: string): Promise<CommandWithItems> {
        const { data } = await gatewayApi.get(`${baseURL}/${id}`);
        return data;
    },

    async create(dto: CreateCommandInput): Promise<Command> {
        const { data } = await gatewayApi.post(baseURL, dto);
        return data;
    },

    async update(id: string, dto: UpdateCommandInput): Promise<Command> {
        const { data } = await gatewayApi.put(`${baseURL}/${id}`, dto);
        return data;
    },

    async delete(id: string): Promise<void> {
        await gatewayApi.delete(`${baseURL}/${id}`);
    },
};
