import { getConnection } from "@repo/config/database"

const db = getConnection()

export async function createCmsDatabase(schema: string) {
  await db.raw(`CREATE SCHEMA IF NOT EXISTS ${schema};
      
CREATE TABLE IF NOT EXISTS ${schema}.cms_collections (
    id SERIAL PRIMARY KEY,
    "userId" integer NOT NULL,
    name character varying(256) NOT NULL UNIQUE,
    type character varying(25) NOT NULL,
    "createdBy" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedBy" integer NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    roles character varying[],
    "columnOrder" character varying(255)[]
);

CREATE TABLE IF NOT EXISTS ${schema}.cms_collection_columns (
    id SERIAL PRIMARY KEY,
    "collectionId" integer REFERENCES ${schema}.cms_collections(id),
    "columnName" character varying(100) NOT NULL,
    "fieldId" character varying(15) NOT NULL,
    type character varying(100) NOT NULL,
    help text DEFAULT ''::text,
    "enableDelete" boolean DEFAULT true,
    "enableSort" boolean DEFAULT true,
    "enableHide" boolean DEFAULT true,
    "enableFilter" boolean DEFAULT true,
    "sortBy" character varying(4) DEFAULT 'asc'::character varying,
    visibility boolean DEFAULT true,
    index jsonb,
    "createdBy" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedBy" integer NOT NULL,
    "fieldOptions" jsonb,
    validation jsonb,
    UNIQUE ("collectionId", "fieldId")
);

CREATE INDEX IF NOT EXISTS idx_collection  ON ${schema}.cms_collection_columns ("collectionId", "fieldId");

CREATE TABLE IF NOT EXISTS ${schema}.cms_documents (
    id SERIAL PRIMARY KEY,
    "collectionId" integer REFERENCES ${schema}.cms_collections(id),
    data jsonb,
    "createdBy" integer,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedBy" integer,
    "updatedAt" timestamp with time zone DEFAULT now()
);
`)
}
