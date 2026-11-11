export const TODO_VALIDATION_MESSAGES = {
    NAME_REQUIRED: 'Le nom du todo est obligatoire.',
    NAME_STRING: 'Le nom du todo doit être une chaîne de caractères.',
    NAME_MIN_LENGTH: 'Le nom du todo doit contenir au moins 3 caractères.',
    NAME_MAX_LENGTH: 'Le nom du todo ne doit pas dépasser 10 caractères.',

    DESCRIPTION_REQUIRED: 'La description du todo est obligatoire.',
    DESCRIPTION_STRING:
        'La description du todo doit être une chaîne de caractères.',
    DESCRIPTION_MIN_LENGTH:
        'La description du todo doit contenir au moins 10 caractères.',

    STATUS_INVALID: 'Le statut doit être une des valeurs autorisées.',
    PAGE_INVALID: 'La page doit être un entier supérieur ou égal à 1.',
    LIMIT_INVALID: 'La limite doit être un entier compris entre 1 et 50.',
};

// rule mte3 taille max w min llname w description -6>bech manab9ach nhot faha fi barcha blayes 
export const TODO_RULES = {
    NAME_MIN: 3,
    NAME_MAX: 10,
    DESCRIPTION_MIN: 10,
};