/// <reference types="node" />
/// <reference types="lodash" />
declare module "Event/NameChangeListener" {
    import { EventEmitter } from 'events';
    import StrictEventEmitter from 'strict-event-emitter-types';
    import UniqueItem from "Base/UniqueItem";
    enum EventEnum {
        BeforeNameChange = "BeforeNameChange",
        AfterNameChange = "AfterNameChange"
    }
    interface CallBack<T> {
        (sender: T, name: string, old: string): void;
    }
    interface Event<T> {
        [EventEnum.BeforeNameChange]: CallBack<T>;
        [EventEnum.AfterNameChange]: CallBack<T>;
    }
    class NameChangeListener<T> {
        readonly ee: StrictEventEmitter<EventEmitter, Event<T>>;
        emitAfterNameChange(sender: T, name: string, old: string): void;
        emitBeforeNameChange(sender: T, name: string, old: string): void;
        onAfterNameChange(callback: CallBack<T>): void;
        onBeforeNameChange(callback: CallBack<T>): void;
    }
    const listener: NameChangeListener<UniqueItem>;
    export default listener;
}
declare module "Base/IKeyValue" {
    export default interface IKeyValue {
        [key: string]: any;
    }
}
declare module "Base/List" {
    export default class List<T> {
        readonly list: Array<T>;
        add(item: T): void;
        remove(item: T): void;
        clear(): void;
        moveUp(item: T): void;
        moveDown(item: T): void;
        swap(left: number, right: number): void;
        toJSON(key: string): {
            list: T[];
        };
    }
}
declare module "Base/INewable" {
    export default interface INewable<T> {
        new (...args: any[]): T;
    }
}
declare module "Base/ItemList" {
    import Item from "Base/Item";
    import List from "Base/List";
    import INewable from "Base/INewable";
    export default class ItemList<T extends Item> extends List<T> {
        readonly type: INewable<T>;
        constructor(type: INewable<T>);
        make(): T;
        load(manager: ItemList<T>): void;
    }
}
declare module "Base/Item" {
    import IKeyValue from "Base/IKeyValue";
    export default class Item {
        protected static IgnoreList: Array<string>;
        protected static IncludeList: Array<string>;
        get ignoreList(): Array<string>;
        get includeList(): Array<string>;
        load(source: Item): void;
        protected loadProperty(name: string, source: IKeyValue): void;
        protected getDescriptor(name: string): PropertyDescriptor | null | undefined;
        toJSON(key: string): IKeyValue;
    }
}
declare module "Base/NameItem" {
    import Item from "Base/Item";
    export default class NameItem extends Item {
        protected _name: string;
        protected static IgnoreList: Array<string>;
        protected static IncludeList: Array<string>;
        constructor(name: string);
        get name(): string;
        set name(name: string);
        get camelCase(): string;
        get snakeCase(): string;
        get wavelCase(): string;
    }
}
declare module "Base/UniqueItem" {
    import NameItem from "Base/NameItem";
    export default class UniqueItem extends NameItem {
        get name(): string;
        set name(name: string);
    }
}
declare module "Base/UniqueList" {
    import ItemList from "Base/ItemList";
    import UniqueItem from "Base/UniqueItem";
    import INewable from "Base/INewable";
    export default class UniqueList<T extends UniqueItem> extends ItemList<T> {
        constructor(type: INewable<T>);
        throwIfExist(name: string): void;
        add(item: T): void;
        find(name: string): T | undefined;
        make(...args: any[]): T;
        load(manager: UniqueList<T>): void;
        sort(): void;
    }
}
declare module "Schema/Rule" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    export default class Rule extends UniqueItem {
        value: string;
    }
    export class RuleManager extends UniqueList<Rule> {
        constructor();
    }
}
declare module "Schema/Seed" {
    import Item from "Base/Item";
    export default class Seed extends Item {
        unique: boolean;
        type: string;
        value: string;
        parameter: string;
    }
}
declare module "Event/ItemDeleteListener" {
    import { EventEmitter } from 'events';
    import StrictEventEmitter from 'strict-event-emitter-types';
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    enum EventEnum {
        BeforeFieldDelete = "BeforeFieldDelete",
        AfterFieldDelete = "AfterFieldDelete"
    }
    interface CallBack<T1, T2> {
        (sender: T1, item: T2): void;
    }
    interface Event<T1, T2> {
        [EventEnum.BeforeFieldDelete]: CallBack<T1, T2>;
        [EventEnum.AfterFieldDelete]: CallBack<T1, T2>;
    }
    class ItemDeleteListener<T1, T2> {
        readonly ee: StrictEventEmitter<EventEmitter, Event<T1, T2>>;
        emitAfterFieldDelete(sender: T1, item: T2): void;
        emitBeforeFieldDelete(sender: T1, item: T2): void;
        onAfterFieldDelete(callback: CallBack<T1, T2>): void;
        onBeforeFieldDelete(callback: CallBack<T1, T2>): void;
    }
    const listener: ItemDeleteListener<UniqueList<UniqueItem>, UniqueItem>;
    export default listener;
}
declare module "Schema/Field" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    import { RuleManager } from "Schema/Rule";
    import Seed from "Schema/Seed";
    export default class Field extends UniqueItem {
        allowNull: boolean;
        cast: string;
        comment: string;
        fillable: boolean;
        hidden: boolean;
        htmlEdit: string;
        htmlIndex: string;
        htmlShow: string;
        included: boolean;
        length: number | string;
        type: string;
        useCurrent: boolean;
        unsigned: boolean;
        value: number | string;
        readonly ruleManager: RuleManager;
        readonly seed: Seed;
        constructor(name: string, type?: string);
        get isIncrement(): boolean;
    }
    export class FieldManager extends UniqueList<Field> {
        constructor();
        make(name: string, type: string): Field;
        remove(item: Field): void;
        get hasIncrement(): boolean;
        get incrementField(): Field | undefined;
    }
}
declare module "Schema/Index" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    export enum IndexTypeEnum {
        index = "index",
        primary = "primary",
        unique = "unique"
    }
    export default class Index extends UniqueItem {
        type: IndexTypeEnum;
        readonly fieldManager: UniqueList<UniqueItem>;
        constructor(name: string, type?: IndexTypeEnum);
    }
    export class IndexManager extends UniqueList<Index> {
        constructor();
        get primaryIndex(): Index | undefined;
        get uniqueIndexList(): Index[];
    }
}
declare module "Schema/Property" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    export default class Property extends UniqueItem {
        data: {};
        tag: string;
        value: string;
    }
    export class PropertyManager extends UniqueList<Property> {
        constructor();
    }
}
declare module "Schema/Preset" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    import { PropertyManager } from "Schema/Property";
    export default class Preset extends UniqueItem {
        original: boolean;
        color: string;
        description: string;
        version: number;
        readonly propertyManager: PropertyManager;
    }
    export class PresetManager extends UniqueList<Preset> {
        constructor();
    }
}
declare module "Schema/Relation" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    import Entity from "Schema/Entity";
    export default class Relation extends UniqueItem {
        type: string;
        parameter: string;
        constructor(name: string, type?: string);
    }
    export class RelationManager extends UniqueList<Relation> {
        constructor();
        link(entity: Entity): Relation;
    }
}
declare module "Schema/Middleware" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    export default class Middleware extends UniqueItem {
    }
    export class MiddlewareManager extends UniqueList<Middleware> {
        constructor();
    }
}
declare module "Schema/Route" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    import { MiddlewareManager } from "Schema/Middleware";
    export default class Route extends UniqueItem {
        method: string;
        path: string;
        routeName: string;
        readonly middlewareManager: MiddlewareManager;
    }
    export class RouteManager extends UniqueList<Route> {
        constructor();
    }
}
declare module "Service/Text" {
    import UniqueItem from "Base/UniqueItem";
    import { DataForScript } from "DataForScript";
    export const script = "function run(data) {\n    /** @type {DataForScript} */\n    const ddd = data\n}\n";
    export function addQuote(text: any, quote?: string): any;
    export function runText(text: string, data: Object): string;
    export function filter(keyword: string, list: Array<UniqueItem>): UniqueItem[];
    export function hasQuote(text: any): boolean;
    export function numberOrQuote(text: any): any;
    export function render(template: string, data: DataForScript): string;
    export function run(code: string, data: object): void;
    export function runAndRender(data: DataForScript): string;
}
declare module "Schema/Entity" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    import { FieldManager } from "Schema/Field";
    import { IndexManager } from "Schema/Index";
    import { PresetManager } from "Schema/Preset";
    import { RelationManager } from "Schema/Relation";
    import { RouteManager } from "Schema/Route";
    import { MiddlewareManager } from "Schema/Middleware";
    export default class Entity extends UniqueItem {
        color: string;
        description: string;
        routeDomain: string;
        routeName: string;
        routePrefix: string;
        script: string;
        tableName: string;
        readonly fieldManager: FieldManager;
        readonly indexManager: IndexManager;
        readonly dataManager: PresetManager;
        readonly middlewareManager: MiddlewareManager;
        readonly relationManager: RelationManager;
        readonly routeManager: RouteManager;
        constructor(name: string);
        getData(name: string): import("Schema/Preset").default | undefined;
        get primaryKey(): string;
        get hasTimeStamp(): boolean;
    }
    export class EntityManager extends UniqueList<Entity> {
        constructor();
    }
}
declare module "Schema/Node" {
    import UniqueItem from "Base/UniqueItem";
    export default class Node extends UniqueItem {
        description: string;
        isLayer: boolean;
        nsPattern: string;
    }
}
declare module "Schema/Option" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    export default class Option extends UniqueItem {
        included: boolean;
        value: string;
        description: string;
    }
    export class OptionManager extends UniqueList<Option> {
        constructor();
    }
}
declare module "Schema/Artisan" {
    import UniqueItem from "Base/UniqueItem";
    import UniqueList from "Base/UniqueList";
    import { OptionManager } from "Schema/Option";
    export default class Artisan extends UniqueItem {
        original: boolean;
        color: string;
        description: string;
        value: string;
        readonly optionManager: OptionManager;
        toString(): string;
    }
    export class ArtisanManager extends UniqueList<Artisan> {
        constructor();
    }
}
declare module "Schema/Folder" {
    import UniqueList from "Base/UniqueList";
    import Layer, { LayerManager } from "Schema/Layer";
    import Node from "Schema/Node";
    interface ActionLayer {
        (layer: Layer): void;
    }
    interface ActionFolder {
        (layer: Folder, path: string): void;
    }
    export default class Folder extends Node {
        isLayer: boolean;
        readonly folderManager: FolderManager;
        readonly layerManager: LayerManager;
        static eachLayer(folder: Folder, action: ActionLayer): void;
        static eachFolder(folder: Folder, parent: string, action: ActionFolder): void;
        find(namexx: string[], layer: string): Layer | undefined;
        findLayer(layer: Layer): Folder[];
        remove(item: Folder | Layer): void;
        removeFolder(folder: Folder): void;
        removeLayer(layer: Layer): void;
        toMap(): Map<string, Layer>;
        get all(): Layer[];
        get children(): Node[];
        get text(): string;
    }
    export class FolderManager extends UniqueList<Folder> {
        constructor();
        make(name: string): Folder;
    }
}
declare module "Schema/Project" {
    import NameItem from "Base/NameItem";
    import { ArtisanManager } from "Schema/Artisan";
    import { EntityManager } from "Schema/Entity";
    import Folder from "Schema/Folder";
    import { PresetManager } from "Schema/Preset";
    export default class Project extends NameItem {
        version: number;
        apiVersion: string;
        dataVersion: string;
        description: string;
        fakerScript: string;
        script: string;
        server: string;
        validationScript: string;
        readonly artisanManager: ArtisanManager;
        readonly entityManager: EntityManager;
        readonly folder: Folder;
        readonly presetManager: PresetManager;
        getEntity(name: string): import("Schema/Entity").default | undefined;
        getLayer(path: string, layer: string): import("Schema/Layer").default | undefined;
        getPreset(name: string): import("Schema/Preset").default | undefined;
    }
}
declare module "Schema/Layer" {
    import UniqueList from "Base/UniqueList";
    import Entity from "Schema/Entity";
    import Node from "Schema/Node";
    import { PresetManager } from "Schema/Preset";
    import Project from "Schema/Project";
    export enum LayerEnum {
        Migration = "Migration",
        Model = "Model"
    }
    export default class Layer extends Node {
        color: string;
        original: boolean;
        requireName: boolean;
        single: boolean;
        description: string;
        classPattern: string;
        filePattern: string;
        nsPattern: string;
        pathPattern: string;
        script: string;
        template: string;
        readonly dataManager: PresetManager;
        getClassName(entity: Entity): string;
        getData(name: string): import("Schema/Preset").default | undefined;
        getFileName(entity: Entity): string;
        getFilePath(project: Project, entity: Entity): string;
        getFullName(project: Project, entity: Entity): string;
        getPathHash(project: Project, entity: Entity): string;
        getNameSpace(project: Project, entity: Entity): string;
        getPath(project: Project, entity: Entity): string;
    }
    export class LayerManager extends UniqueList<Layer> {
        constructor();
        make(name: string): Layer;
    }
}
declare module "DataForScript" {
    import { LoDashStatic } from 'lodash';
    import Entity from "Schema/Entity";
    import Layer from "Schema/Layer";
    import Project from "Schema/Project";
    export interface DataForScript {
        entity: Entity;
        layer: Layer;
        lodash: LoDashStatic;
        project: Project;
    }
}
declare module "Base/IUniqueItemWithColor" {
    import UniqueItem from "Base/UniqueItem";
    export default interface IUniqueItemWithColor extends UniqueItem {
        color: string;
    }
}
declare module "Service/SideBar" {
    import IUniqueItemWithColor from "Base/IUniqueItemWithColor";
    import UniqueList from "Base/UniqueList";
    export default class SideBar {
        readonly manager: UniqueList<IUniqueItemWithColor> | null;
        color: string;
        otherColor: string;
        item: IUniqueItemWithColor | null;
        keyword: string;
        constructor(manager: UniqueList<IUniqueItemWithColor>);
        get list(): import("Base/UniqueItem").default[];
    }
}
declare module "Dialogue/Dialogue" {
    export default class Dialogue {
        size: string;
        title: string;
        visible: boolean;
        callback: CallableFunction | null;
        show(title: string, callback?: CallableFunction | null): void;
        hide(): void;
    }
}
declare module "Dialogue/InputDialogue" {
    import Dialogue from "Dialogue/Dialogue";
    export default class InputDialogue extends Dialogue {
        text: string;
        showText(title: string, text: string, callback: CallableFunction, size?: string): void;
    }
}
declare module "Dialogue/ListDialogue" {
    import Dialogue from "Dialogue/Dialogue";
    import Item from "Base/Item";
    import UniqueItem from "Base/UniqueItem";
    export default class ListDialogue extends Dialogue {
        keyword: string;
        source: Array<UniqueItem>;
        selected: Item | null;
        showBlank: boolean;
        get list(): UniqueItem[];
        showList(list: Array<UniqueItem>, title: string, callback: CallableFunction, size?: string): void;
        showWithBlank(list: Array<UniqueItem>, title: string, callback: CallableFunction, size?: string): void;
        select(item: Item): void;
    }
}
declare module "Service/Loader" {
    import Project from "Schema/Project";
    export default class Loader {
        static load(source: Project, preset: Project): Project;
        private static loadPreset;
        private static addIfNotExist;
        private static isProject;
    }
}
declare module "DataBase/IData" {
    export enum DriverEnum {
        mysql = "mysql",
        pgsql = "pgsql"
    }
    export interface IData {
        driver: DriverEnum;
        database: string;
        prefix: string;
        tables: Array<ITableMySQL | ITablePGSQL>;
    }
    export interface ITable {
        included: boolean;
        name: string;
    }
    export interface ITableMySQL extends ITable {
        fields: Array<IFieldMySQL>;
        indexes: Array<IIndexMySQL>;
    }
    export interface IFieldMySQL {
        Field: string;
        Default: string;
        Extra: string;
        Key: string;
        Null: string;
        Type: string;
    }
    export interface IIndexMySQL {
        Column_name: string;
        Key_name: string;
        Non_unique: number;
        Seq_in_index: number;
        Table: string;
    }
    export interface ITablePGSQL extends ITable {
        fields: Array<IFieldPGSQL>;
        indexes: Array<IIndexPGSQL>;
    }
    export interface IFieldPGSQL {
        character_maximum_length: number;
        column_name: string;
        column_default: string;
        numeric_scale: number;
        numeric_precision: number;
        is_nullable: string;
        data_type: string;
    }
    export interface IIndexPGSQL {
        indexdef: string;
        indexname: string;
    }
}
declare module "DataBase/DBConvertor" {
    import { IData, ITableMySQL, ITablePGSQL } from "DataBase/IData";
    import Entity from "Schema/Entity";
    import Field from "Schema/Field";
    import Project from "Schema/Project";
    import { PropertyManager } from "Schema/Property";
    export default abstract class DBConvertor {
        readonly preset: Project;
        readonly project: Project;
        readonly fieldManager: PropertyManager;
        readonly incrementManager: PropertyManager;
        readonly fieldTypeIntegerManager: PropertyManager;
        readonly fieldSpecialManager: PropertyManager | null;
        readonly skip: boolean;
        constructor(project: Project, preset: Project, skip: boolean);
        convert(data: IData): void;
        getIncrement(name: string): import("Schema/Property").default | undefined;
        editSpecialField(field: Field): void;
        isInteger(field: Field): boolean;
        abstract getPresetKeyOfFieldType(): string;
        abstract getPresetKeyOfIncrementMap(): string;
        abstract convertTable(table: ITableMySQL | ITablePGSQL, entity: Entity): void;
    }
}
declare module "DataBase/MySQLConvertor" {
    import DBConvertor from "DataBase/DBConvertor";
    import { ITableMySQL, IFieldMySQL, IIndexMySQL } from "DataBase/IData";
    import Entity from "Schema/Entity";
    export default class MySQLConvertor extends DBConvertor {
        getPresetKeyOfFieldType(): string;
        getPresetKeyOfIncrementMap(): string;
        convertTable(table: ITableMySQL, entity: Entity): void;
        convertField(field: IFieldMySQL, entity: Entity): import("Schema/Field").default;
        convertIndex(table: ITableMySQL, entity: Entity): void;
        addIndex(name: string, list: Array<IIndexMySQL>, entity: Entity): void;
        getTypeName(name: string): string;
        convertType(field: IFieldMySQL): string;
    }
}
declare module "DataBase/PGSQLConvertor" {
    import DBConvertor from "DataBase/DBConvertor";
    import { ITablePGSQL, IFieldPGSQL, IIndexPGSQL } from "DataBase/IData";
    import Entity from "Schema/Entity";
    import { IndexTypeEnum } from "Schema/Index";
    export default class PGSQLConvertor extends DBConvertor {
        getPresetKeyOfFieldType(): string;
        getPresetKeyOfIncrementMap(): string;
        convertTable(table: ITablePGSQL, entity: Entity): void;
        convertField(field: IFieldPGSQL, entity: Entity): import("Schema/Field").default;
        convertIndex(table: ITablePGSQL, entity: Entity): void;
        addPrimary(list: Array<string>, entity: Entity): void;
        addIndex(type: IndexTypeEnum, list: Array<string>, entity: Entity): void;
        getIndexFieldNameList(index: IIndexPGSQL): string[];
        convertType(field: IFieldPGSQL): string;
    }
}
declare module "DataBase/Convertor" {
    import { IData } from "DataBase/IData";
    import Project from "Schema/Project";
    export default class Convertor {
        readonly preset: Project;
        readonly project: Project;
        readonly skip: boolean;
        constructor(project: Project, preset: Project, skip?: boolean);
        convert(data: IData): void;
    }
}
declare module "Dialogue/NameDialogue" {
    import Dialogue from "Dialogue/Dialogue";
    export default class NameDialogue extends Dialogue {
        size: string;
        text: string;
        showInput(title: string, text?: string, callback?: CallableFunction | null): void;
    }
}
declare module "Bridge/ActionEnum" {
    export enum ActionEnum {
        edit = "edit",
        error = "error",
        get = "get",
        load = "load",
        move = "move",
        open = "open",
        post = "post",
        read = "read",
        refresh = "refresh",
        save = "save",
        write = "write"
    }
}
declare module "Bridge/IResponse" {
    import { ActionEnum } from "Bridge/ActionEnum";
    export default interface IResponse {
        action: ActionEnum;
        data: any;
        key: string;
        message: string;
        status: number;
    }
}
declare module "Bridge/IHandler" {
    import IResponse from "Bridge/IResponse";
    export default interface IHandler {
        (data: IResponse): void;
    }
}
declare module "Bridge/HandlerManager" {
    import { ActionEnum } from "Bridge/ActionEnum";
    import IHandler from "Bridge/IHandler";
    export default class HandlerManager {
        readonly map: Map<ActionEnum, Map<string, IHandler>>;
        constructor();
        make(action: ActionEnum): void;
        add(action: ActionEnum, key: string, handler?: IHandler): void;
        find(action: ActionEnum, key: string): IHandler | undefined;
    }
}
declare module "Bridge/Bridge" {
    import { ActionEnum } from "Bridge/ActionEnum";
    import HandlerManager from "Bridge/HandlerManager";
    import IResponse from "Bridge/IResponse";
    export default class Bridge {
        readonly manager: HandlerManager;
        constructor(manager: HandlerManager);
        call(response: IResponse): void;
        isHTTP(action: ActionEnum): boolean;
        error(code: number, message: string): void;
    }
}
declare module "Bridge/IJavaBridge" {
    export default interface IJavaBridge {
        call(json: string): void;
    }
}
declare module "Bridge/ICEFW" {
    import Bridge from "Bridge/Bridge";
    import IJavaBridge from "Bridge/IJavaBridge";
    export default interface ICEFW extends Window {
        bridge: Bridge;
        JavaBridge: IJavaBridge;
    }
}
declare module "Bridge/Response" {
    import { ActionEnum } from "Bridge/ActionEnum";
    import IResponse from "Bridge/IResponse";
    export default class Response implements IResponse {
        action: ActionEnum;
        key: string;
        data: string;
        message: string;
        status: number;
        constructor(action: ActionEnum, key: string, data: string, message: string, status: number);
    }
}
declare module "Service/Save" {
    import Project from "Schema/Project";
    import IHandler from "Bridge/IHandler";
    import Route from "Bridge/Route";
    export default class Save {
        static last: string;
        static run(project: Project, route: Route, handler?: IHandler): void;
        private static get fake();
        private static makeName;
    }
}
declare module "Bridge/Payload" {
    import { ActionEnum } from "Bridge/ActionEnum";
    export default class Payload {
        action: ActionEnum;
        key: string;
        data: string;
        constructor(action: ActionEnum, key: string, data: string);
        static make(action: ActionEnum, key: string, data: string): Payload;
    }
}
declare module "Bridge/ToJava" {
    import { ActionEnum } from "Bridge/ActionEnum";
    import HandlerManager from "Bridge/HandlerManager";
    import ICEFW from "Bridge/ICEFW";
    import IHandler from "Bridge/IHandler";
    export default class ToJava {
        readonly manager: HandlerManager;
        readonly window: ICEFW;
        constructor(window: ICEFW, manager: HandlerManager);
        send(action: ActionEnum, key: string, data: string, handler?: IHandler): void;
    }
}
declare module "Bridge/Route" {
    import Project from "Schema/Project";
    import { ActionEnum } from "Bridge/ActionEnum";
    import IHandler from "Bridge/IHandler";
    import ToJava from "Bridge/ToJava";
    export default class Route {
        readonly service: ToJava;
        constructor(service: ToJava);
        call(action: ActionEnum, key: string, data: string, handler?: IHandler): void;
        edit(file: string, data: string, handler?: IHandler): void;
        get(route: string, data: string, handler?: IHandler): void;
        move(file: string, destination: string, handler?: IHandler): void;
        open(file: string, handler?: IHandler): void;
        post(route: string, data: string, handler?: IHandler): void;
        read(file: string, data: string, handler?: IHandler): void;
        refresh(handler?: IHandler): void;
        save(project: Project, handler?: IHandler): void;
        write(file: string, data: string, handler?: IHandler): void;
    }
}
declare module "Bridge/StatusEnum" {
    export enum StatusEnum {
        OK = 200,
        Error = 400
    }
}
declare module "Service/Start" {
    import ICEFW from "Bridge/ICEFW";
    import Route from "Bridge/Route";
    import State from "State";
    export default class Start {
        static run(state: State, window: ICEFW): Route;
    }
}
declare module "Service/RunScript" {
    import Entity from "Schema/Entity";
    import Layer from "Schema/Layer";
    import Project from "Schema/Project";
    export default class RunScript {
        static runAndRender(project: Project, layer: Layer, entity: Entity): string;
        static runFaker(project: Project, entity: Entity): void;
        static runValidation(project: Project, entity: Entity): void;
    }
}
declare module "State" {
    import Project from "Schema/Project";
    import SideBar from "Service/SideBar";
    import InputDialogue from "Dialogue/InputDialogue";
    import ListDialogue from "Dialogue/ListDialogue";
    import Layer from "Schema/Layer";
    import Entity from "Schema/Entity";
    import { IData } from "DataBase/IData";
    import NameDialogue from "Dialogue/NameDialogue";
    import ICEFW from "Bridge/ICEFW";
    import Route from "Bridge/Route";
    export default class State {
        error: null;
        route: Route;
        readonly preset: Project;
        project: Project | null;
        sidebar: SideBar | null;
        readonly inputDialogue: InputDialogue;
        readonly listDialogue: ListDialogue;
        readonly nameDialogue: NameDialogue;
        private sidebarArtisan;
        private sidebarEntity;
        private sidebarLayer;
        private sidebarPreset;
        constructor(window: ICEFW, preset: Project);
        private prepare;
        convert(data: IData, skip: boolean): void;
        create(name: string): void;
        load(data: Project): void;
        showArtisan(): void;
        showEntity(): void;
        showLayer(): void;
        showPreset(): void;
        getEntity(name: string): Entity | undefined;
        getLayer(path: string, layer: string): Layer | undefined;
        getProject(): Project;
        getPreset(name: string): import("Schema/Preset").default | undefined;
        render(layer: Layer, entity: Entity): string;
        setFaker(entity: Entity): void;
        setValidation(entity: Entity): void;
        get ready(): boolean;
    }
}
