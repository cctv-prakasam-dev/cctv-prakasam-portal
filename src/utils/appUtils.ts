const SLUG_SEPARATORS = /[ /&]/g;
const SLUG_SPECIAL_CHARS = /[^\w-]+/g;
const SLUG_DUPLICATE_DASHES = /(-)\1+/g;
const COLON_PATTERN = /:/g;
const HASH_PREFIX = /^#/;

function makeSlug(name: string) {
  // converting name to lower case then spaces replacing with '-'
  // removing other special chars
  return name
    .trim()
    .toLowerCase()
    .replace(SLUG_SEPARATORS, "-")
    .replace(SLUG_SPECIAL_CHARS, "")
    .replace(SLUG_DUPLICATE_DASHES, (_str, match) => {
      // removing duplicate consecutive '-'
      return match[0];
    });
}

function fileNameHelper(fileName: string, docType?: string) {
  let [fileOriginalName, fileExtension] = fileName.split(".");

  fileOriginalName = makeSlug(fileOriginalName);

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const formattedTime = currentDate
    .toTimeString()
    .split(" ")[0]
    .replace(COLON_PATTERN, "");

  const uniqueFileName = `b2c/users/${docType}/${formattedDate}_${formattedTime}_${fileOriginalName}.${fileExtension}`;

  return uniqueFileName;
}

function publicFileNameHelper(fileName: string) {
  let [fileOriginalName, fileExtension] = fileName.split(".");

  // Remove spaces and special characters from the fileOriginalName
  fileOriginalName = makeSlug(fileOriginalName);

  // Get the current date and format it
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  // Get the current time and format it (HHmmss)
  const formattedTime = currentDate
    .toTimeString()
    .split(" ")[0]
    .replace(COLON_PATTERN, "");

  // Construct the unique filename with date and time
  const uniqueFileName = `${formattedDate}_${formattedTime}_${fileOriginalName}.${fileExtension}`;

  return uniqueFileName;
}

/**
 * Generates file key for case files stored in R2.
 * Key format: {prefix}/cases/{tempId}/{docType}/{date_time_filename}.ext
 * This matches the folder filter used by AutoRAG: `{prefix}/cases/{caseTempId}/`
 */
function caseFileNameHelper(fileName: string, tempId: string, docType?: string, prefix: string = "b2c") {
  const safeTempId = tempId.replace(HASH_PREFIX, "");
  let [fileOriginalName, fileExtension] = fileName.split(".");

  fileOriginalName = makeSlug(fileOriginalName);

  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];
  const formattedTime = currentDate
    .toTimeString()
    .split(" ")[0]
    .replace(COLON_PATTERN, "");

  const docFolder = docType ? `${docType}/` : "";
  const uniqueFileName = `${prefix}/cases/${safeTempId}/${docFolder}${formattedDate}_${formattedTime}_${fileOriginalName}.${fileExtension}`;

  return uniqueFileName;
}

const CASE_FILE_PREFIX = "b2c/cases/";

export { CASE_FILE_PREFIX, caseFileNameHelper, fileNameHelper, makeSlug, publicFileNameHelper };
