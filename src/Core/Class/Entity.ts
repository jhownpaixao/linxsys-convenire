import { InferCreationAttributes, InferAttributes, Model as SequelizeModel, WhereOptions, Attributes } from 'sequelize';
import { ModelType, ObjectWithDynamicKey } from '../Types';
import { MakeNullishOptional } from 'sequelize/types/utils';

/* Integrated with Sequelize */
export abstract class Model<M extends SequelizeModel<InferAttributes<M>, InferCreationAttributes<M>>> {
    [index: string]: unknown;
    public id: number | string | undefined;
    public model: ModelType<M>;
    private props: string[] = [];
    private mainProps = ['mainProps', 'props', 'model', 'data'];
    public data: ObjectWithDynamicKey = {};

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(model: any) {
        this.model = model;
        this.init();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private async ManualSync(data: any) {
        for (const [key, prop] of Object.entries(data)) {
            if (!this.props.includes(key)) continue;
            this[key] = prop;
            this.data[key] = prop;
        }
        return true;
    }

    protected async init() {
        for (const [key] of Object.entries(this)) {
            if (this.mainProps.includes(key)) continue;
            this.props.push(key);
        }
    }

    public async load(id: number | string) {
        try {
            const process = await this.model.findByPk(id);
            if (!process || Object.values(process).length < 1) return false;
            await this.ManualSync(process);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async loadwith(params: WhereOptions<Attributes<M>> | undefined) {
        const process = await this.model.findOne({ where: params });
        if (!process) return false;
        try {
            await this.ManualSync(process);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async get(id: number | string) {
        try {
            const process = await this.model.findOne({ where: { id } as unknown as WhereOptions<Attributes<M>> });
            if (!process) return false;
            return process;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async getwith(params: WhereOptions<Attributes<M>> | undefined) {
        try {
            const process = await this.model.findOne({ where: params });
            if (!process) return false;
            return process;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async List() {
        const operation = await this.model.findAll();
        return operation;
    }

    public async create(props: MakeNullishOptional<InferCreationAttributes<M>>) {
        try {
            const operation = await this.model.create(props);
            return operation;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async update() {
        const data: Record<string, unknown> = {};

        const process = await this.get(String(this.id));
        if (!process) return false;

        for (const prop of this.props) {
            data[prop] = this[prop];
        }
        try {
            await process.update(
                data as {
                    [key in keyof InferAttributes<M, { omit: never }>]?: InferAttributes<M, { omit: never }>[key] | undefined;
                }
            );
            return true;
        } catch (error) {
            console.log(error);
            await this.load(String(this.id));
            return false;
        }
    }

    public async exclude() {
        const process = await this.get(String(this.id));
        if (!process) return false;

        await process.destroy();
        return true;
    }

    public async excludewith(params: WhereOptions<Attributes<M>> | undefined) {
        try {
            const process = await this.getwith(params);
            if (!process) return false;
            await process.destroy;
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}
