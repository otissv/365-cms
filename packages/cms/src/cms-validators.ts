import { z } from "zod"

import type { CustomError } from "@repo/lib/customError"
import { validate } from "@repo/lib/validate"

import type {
  CmsCollection,
  CmsCollectionColumn,
  CmsCollectionColumnInsert,
  CmsCollectionColumnUpdate,
  CmsCollectionDocument,
  CmsCollectionDocumentInsert,
  CmsCollectionDocumentUpdate,
  CmsCollectionInsert,
  CmsCollectionUpdate,
  FormCmsCollectionInsertValidator,
} from "./cms.types"

const columnOrderValidator = z.array(z.string()).default([])

/** Cms Collection **/
export const cmsCollectionValidator = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  name: z
    .string({
      required_error: "Name is required.",
      invalid_type_error: "Name must be a string.",
    })
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters." }),
  type: z.enum(["multiple", "single"]),
  roles: z.array(z.string()).default([]).optional(),
  columnOrder: columnOrderValidator.optional(),
  createdAt: z.coerce.date(),
  createdBy: z.number().int().positive(),
  updatedAt: z.coerce.date(),
  updatedBy: z.number().int().positive(),
  isPublished: z.boolean().optional(),
})

/** Cms Collection Document **/
export const cmsCollectionDocumentValidator = z.object({
  id: z.number().int().positive(),
  collectionId: z.number().int().positive(),
  data: z.record(z.string(), z.any()).optional(),
  createdAt: z.coerce.date(),
  createdBy: z.number().int().positive(),
  updatedAt: z.coerce.date(),
  updatedBy: z.number().int().positive(),
})

export const cmsCollectionDocumentInsertValidator = z.object({
  collectionId: z.number().int().positive(),
  data: z.array(z.record(z.string(), z.any()).optional()),
})

export const cmsCollectionDocumentUpdateValidator =
  cmsCollectionDocumentValidator
    .omit({
      id: true,
      updatedAt: true,
      updatedBy: true,
    })
    .partial()

export async function cmsCollectionDocumentValidate(
  data: CmsCollectionDocument
): Promise<CmsCollectionDocument | CustomError> {
  return validate(cmsCollectionDocumentValidator)(data)
}
export async function cmsCollectionDocumentInsertValidate(
  data: CmsCollectionDocumentInsert
): Promise<CmsCollectionDocumentInsert | CustomError> {
  return validate(cmsCollectionDocumentInsertValidator)(data)
}

export async function cmsCollectionDocumentUpdateValidate(
  data: CmsCollectionDocumentUpdate
): Promise<CmsCollectionDocumentUpdate | CustomError> {
  return validate(cmsCollectionDocumentUpdateValidator)(data)
}

/** Cms Collection Column **/
export const cmsCollectionColumnDefaultValidator = z.object({
  id: z.number().int().positive(),
  columnName: z
    .string({
      required_error: "Column name is required.",
      invalid_type_error: "Must contain between 1 and 100 characters.",
    })
    .min(1, "Must contain between 1 and 100 characters.")
    .max(100, "Must contain between 1 and 100 characters."),
  collectionId: z
    .number()
    .int()
    .positive()
    .min(1, "Must contain between 1 and 50 characters.")
    .max(50, "Must contain between 1 and 50 characters."),
  fieldId: z
    .string({ required_error: "Field ID is required." })
    .min(1, "Must contain between 1 and 15 characters.")
    .max(15, "Must contain between 1 and 15 characters."),
  type: z.string(),
  fieldOptions: z.record(z.string(), z.any()).optional(),
  validation: z.record(z.string(), z.any()).optional(),
  help: z.string().optional(),
  enableDelete: z.boolean().optional(),
  enableSort: z.boolean().optional(),
  enableHide: z.boolean().optional(),
  enableFilter: z.boolean().optional(),
  filter: z.union([z.string(), z.number(), z.boolean()]).optional(),
  sortBy: z.enum(["asc", "desc"]).optional().default("asc").optional(),
  visibility: z.boolean().optional().default(true).optional(),
  index: z
    .object({
      direction: z.enum(["asc", "desc"]),
      nulls: z.enum(["first", "last"]),
    })
    .optional(),
  createdAt: z.coerce.date(),
  createdBy: z.number().int().positive(),
  updatedAt: z.coerce.date(),
  updatedBy: z.number().int().positive(),
})

export const cmsCollectionRequiredColumnValidator =
  cmsCollectionColumnDefaultValidator.extend({
    validation: z
      .object({
        required: z.boolean().optional(),
      })
      .optional(),
  })
export const cmsCollectionEmailColumnValidator =
  cmsCollectionColumnDefaultValidator.extend({
    validation: z
      .object({
        required: z.boolean().optional(),
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
        disallowCharacters: z.string().optional(),
      })
      .optional(),
  })
export const cmsCollectionTextColumnValidator =
  cmsCollectionColumnDefaultValidator.extend({
    validation: z
      .object({
        required: z.boolean().optional(),
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
        disallowCharacters: z.string().optional(),
      })
      .optional(),
  })
export const cmsCollectionNumberColumnValidator =
  cmsCollectionColumnDefaultValidator.extend({
    validation: z
      .object({
        required: z.boolean().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
      })
      .optional(),
  })
export const cmsCollectionFileColumnValidator =
  cmsCollectionColumnDefaultValidator.extend({
    validation: z
      .object({
        required: z.boolean().optional(),
        size: z.number().optional(),
      })
      .optional(),
  })
export const cmsCollectionFilesColumnValidator =
  cmsCollectionColumnDefaultValidator.extend({
    validation: z
      .object({
        required: z.boolean().optional(),
        size: z.number().optional(),
        minItems: z.number().optional(),
        maxItems: z.number().optional(),
      })
      .optional(),
  })
export const cmsCollectionDateColumnValidator =
  cmsCollectionColumnDefaultValidator.extend({
    validation: z
      .object({
        required: z.boolean().optional(),
        before: z.coerce.date().optional(),
        after: z.coerce.date().optional(),
        start: z.coerce.date().optional(),
        end: z.coerce.date().optional(),
      })
      .optional(),
  })
export const cmsCollectionTimeColumnValidator =
  cmsCollectionColumnDefaultValidator.extend({
    validation: z
      .object({
        required: z.boolean().optional(),
        start: z.coerce.date().optional(),
        end: z.coerce.date().optional(),
      })
      .optional(),
  })
export const cmsCollectionTagsColumnValidator =
  cmsCollectionColumnDefaultValidator.extend({
    validation: z
      .object({
        required: z.boolean().optional(),
        minItems: z.number().optional(),
        maxItems: z.number().optional(),
        minLength: z.number().optional(),
        maxLength: z.number().optional(),
        disallowCharacters: z.string().optional(),
      })
      .optional(),
  })

export const cmsCollectionInternetColumnValidator =
  cmsCollectionColumnDefaultValidator.extend({
    validation: z
      .object({
        required: z.boolean().optional(),
        blacklist: z.array(z.string()).optional(),
        disallowCharacters: z.string().optional(),
      })
      .optional(),
  })

export const cmsCollectionColumnValidator = z.union([
  cmsCollectionRequiredColumnValidator,
  cmsCollectionTextColumnValidator,
  cmsCollectionNumberColumnValidator,
  cmsCollectionFileColumnValidator,
  cmsCollectionFilesColumnValidator,
  cmsCollectionDateColumnValidator,
  cmsCollectionTimeColumnValidator,
  cmsCollectionTagsColumnValidator,
  cmsCollectionInternetColumnValidator,
])
export const cmsCollectionColumnInsertValidator = z.union([
  cmsCollectionRequiredColumnValidator
    .omit({
      id: true,
      fieldId: true,
    })
    .extend({
      columnOrder: columnOrderValidator,
    }),
  cmsCollectionTextColumnValidator
    .omit({
      id: true,
      fieldId: true,
    })
    .extend({
      columnOrder: columnOrderValidator,
    }),
  cmsCollectionNumberColumnValidator
    .omit({
      id: true,
      fieldId: true,
    })
    .extend({
      columnOrder: columnOrderValidator,
    }),
])
export const cmsCollectionColumnUpdateValidator = z.union([
  cmsCollectionRequiredColumnValidator
    .omit({
      id: true,
      fieldId: true,
      updatedAt: true,
      updatedBy: true,
    })
    .partial(),
  cmsCollectionTextColumnValidator
    .omit({
      id: true,
      fieldId: true,
      updatedAt: true,
      updatedBy: true,
    })
    .partial(),
  cmsCollectionNumberColumnValidator
    .omit({
      id: true,
      fieldId: true,
      createdAt: true,
      updatedAt: true,
      updatedBy: true,
    })
    .partial(),
])

export async function cmsCollectionColumnValidate(
  data: CmsCollectionColumn
): Promise<CmsCollectionColumn | CustomError> {
  return validate(cmsCollectionColumnValidator)(data)
}
export async function cmsCollectionColumnInsertValidate(
  data: CmsCollectionColumnInsert
): Promise<CmsCollectionColumnInsert | CustomError> {
  return validate(cmsCollectionColumnInsertValidator)(data)
}
export async function cmsCollectionColumnUpdateValidate(
  data: CmsCollectionColumnUpdate
): Promise<CmsCollectionColumnUpdate | CustomError> {
  return validate(cmsCollectionColumnUpdateValidator)(data)
}

export const cmsCollectionUpdateValidator = cmsCollectionValidator
  .omit({
    id: true,
    updatedAt: true,
    updatedBy: true,
  })
  .partial()

export const cmsCollectionInsertValidator = cmsCollectionValidator.omit({
  id: true,
  columnOrder: true,
  createdAt: true,
  createdBy: true,
  updatedAt: true,
  updatedBy: true,
})

export const formCmsCollectionInsertValidator =
  cmsCollectionInsertValidator.omit({
    userId: true,
  })

export async function cmsCollectionValidate(
  data: CmsCollection
): Promise<CmsCollection | CustomError> {
  return validate(cmsCollectionValidator)(data)
}
export async function cmsCollectionInsertValidate(
  data: CmsCollectionInsert
): Promise<CmsCollectionInsert | CustomError> {
  return validate(cmsCollectionInsertValidator)(data)
}
export async function cmsCollectionUpdateValidate(
  data: CmsCollectionUpdate
): Promise<CmsCollectionUpdate | CustomError> {
  return validate(cmsCollectionUpdateValidator)(data)
}

export async function formCmsCollectionInsertFormValidate(
  data: FormCmsCollectionInsertValidator
): Promise<FormCmsCollectionInsertValidator | CustomError> {
  return validate(formCmsCollectionInsertValidator)(data)
}

/* CMS UI */

export const cmsColumnDialogValidator =
  cmsCollectionColumnDefaultValidator.pick({
    type: true,
    columnName: true,
    fieldId: true,
    help: true,
    index: true,
    validation: true,
    fieldOptions: true,
    sortBy: true,
  })
