
CREATE TABLE t_1.cms_collections (
    PRIMARY KEY (id),
    "userId" integer NOT NULL,
    name character varying(256) NOT NULL,
    type character varying(25) NOT NULL,
    "createdBy" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedBy" integer NOT NULL,
    "isPublished" boolean DEFAULT false NOT NULL,
    roles character varying[],
    "columnOrder" character varying(255)[]
);

CREATE TABLE t_1.cms_collection_columns (
    PRIMARY KEY (id),
    "collectionId" integer NOT NULL,
    "columnName" character varying(100) NOT NULL,
    "fieldId" character varying(15) NOT NULL,
    type character varying(100) NOT NULL,
    "defaultValue" jsonb,
    help text DEFAULT ''::text,
    "enableDelete" boolean DEFAULT true,
    "enableSort" boolean DEFAULT true,
    "enableHide" boolean DEFAULT true,
    "enableFilter" boolean DEFAULT true,
    filter jsonb,
    "sortBy" character varying(4) DEFAULT 'asc'::character varying,
    visibility boolean DEFAULT true,
    index jsonb,
    "createdBy" integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
    "updatedBy" integer NOT NULL,
    "fieldOptions" jsonb,
    validation jsonb
    CONSTRAINT "fk_collection" FOREIGN KEY ("collectionId" ) REFERENCES t_1.cms_collections(id),
);



CREATE TABLE t_1.cms_documents (
    PRIMARY KEY (id),
    "collectionId" integer,
    "createdBy" integer,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedBy" integer,
    "updatedAt" timestamp with time zone DEFAULT now(),
    data jsonb
    CONSTRAINT "fk_collection" FOREIGN KEY ("collectionId" ) REFERENCES t_1.cms_collections(id),
);