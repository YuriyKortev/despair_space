export type Language = 'en' | 'ru';

export interface TranslationStrings {
  // App title
  appTitle: string;
  appSubtitle: string;

  // Characters
  characters: {
    noCharacters: string;
    createFirst: string;
    addCharacter: string;
    editCharacter: string;
    deleteCharacter: string;
    confirmDelete: string;
    name: string;
    namePlaceholder: string;
    color: string;
    points: string;
    connections: string;
    hide: string;
    show: string;
    export: string;
    import: string;
    importSuccess: string;
    importError: string;
    copyPrompt: string;
    promptCopied: string;
    loadExample: string;
  };

  // Character core
  characterCore: {
    history: string;
    historyPlaceholder: string;
    addEvent: string;
    body: string;
    bodyPlaceholder: string;
    gift: string;
    giftPlaceholder: string;
  };

  // Points
  points: {
    selectCharacterFirst: string;
    addPoint: string;
    editPoint: string;
    deletePoint: string;
    confirmDelete: string;
    momentName: string;
    momentNamePlaceholder: string;
    coordinates: string;
    shortLabel: string;
    labelPlaceholder: string;
    detailedDescription: string;
    descriptionPlaceholder: string;
    generate: string;
    save: string;
    create: string;
    setAsRoot: string;
    isRoot: string;
    viewDetails: string;
    viewPath: string;
  };

  // Connections
  connections: {
    connect: string;
    cancelConnect: string;
    selectTarget: string;
    editConnection: string;
    deleteConnection: string;
    confirmDelete: string;
    transitionType: string;
    crisis: string;
    crisisTrigger: string;
    crisisTriggerPlaceholder: string;
    alternatives: string;
    alternativesPlaceholder: string;
    addAlternative: string;
    unknownTrigger: string;
    evolutionHint: string;
    crisisHint: string;
    branchHint: string;
  };

  // Transition types
  transitionTypes: {
    evolution: string;
    crisis: string;
    branch: string;
  };

  // Stages
  stages: {
    title: string;
    aesthetic: string;
    ethical: string;
    religious: string;
  };

  // Stage subtypes
  stageSubtypes: {
    sensual: string;
    romantic: string;
    intellectual: string;
    civic: string;
    heroic: string;
    immanent: string;
    paradoxical: string;
  };

  // Axes
  axes: {
    finiteInfinite: string;
    finite: string;
    infinite: string;
    necessityPossibility: string;
    necessity: string;
    possibility: string;
    consciousness: string;
    unawareness: string;
    awareness: string;
    balance: string;
    semiconscious: string;
  };

  // Axis subtypes
  axisSubtypes: {
    despairOfInfinity: string;
    despairOfFinitude: string;
    despairOfPossibility: string;
    despairOfNecessity: string;
    unawarenessTitle: string;
    awarenessTitle: string;
    coordinateAbove: string;
    coordinateBelow: string;
    // Infinity
    imagination: string;
    cognition: string;
    feeling: string;
    will: string;
    // Finitude
    conformist: string;
    prudent: string;
    // Possibility
    combinatorial: string;
    paralyzed: string;
    // Necessity
    fatalist: string;
    determinist: string;
    // Unawareness
    naive: string;
    busy: string;
    denial: string;
    // Awareness
    suffering: string;
    defiant: string;
  };

  // Salvation point
  salvationPoint: {
    title: string;
    description: string;
  };

  // Labels (generated for points)
  labels: {
    dreamerUnknowing: string;
    reflectionDevours: string;
    grandPlansInFog: string;
    polishedPebble: string;
    knowsCageAccepted: string;
    vaguelyFeelsWalls: string;
    fatalistGrandIdeas: string;
    knowsUselessness: string;
    conformistPlaying: string;
    seesExitsFears: string;
    lostInAbstractions: string;
    awaresDetachment: string;
    dissolvedInWorld: string;
    knowsLimitations: string;
    floatsInPossibilities: string;
    awaresChoiceParalysis: string;
    acceptedFateUnthinking: string;
    consciousDeterminist: string;
    awaresOwnDespair: string;
    unawareOfIllness: string;
    vagueAnxiety: string;
    stageLabel: string;
  };

  // Path detail modal
  pathDetail: {
    title: string;
    noPath: string;
    rootPoint: string;
    pathToPoint: string;
    step: string;
    via: string;
    authorDescription: string;
    stateAnalysis: string;
  };

  // Point detail modal
  pointDetail: {
    stage: string;
    coordinates: string;
    close: string;
  };

  // Common actions
  actions: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
  };

  // Settings
  settings: {
    language: string;
  };

  // Keyboard shortcuts legend
  shortcuts: {
    leftClick: string;
    rightClick: string;
    scroll: string;
    clickPoint: string;
    doubleClick: string;
    shiftClick: string;
    clickConnection: string;
    shiftClickToConnect: string;
    doubleClickForPath: string;
  };

  // Presets
  presets: {
    raskolnikov: {
      name: string;
      core: {
        history: string[];
        body: string;
        gift: string;
      };
      points: {
        r1: { momentName: string; label: string; description: string };
        r2: { momentName: string; label: string; description: string };
        r3: { momentName: string; label: string; description: string };
        r4: { momentName: string; label: string; description: string };
        r5: { momentName: string; label: string; description: string };
        r6: { momentName: string; label: string; description: string };
      };
      connections: {
        c1: { trigger: string; alternatives: string[] };
        c3: { trigger: string; alternatives: string[] };
        c5: { trigger: string; alternatives: string[] };
      };
    };
  };
}

export interface DescriptionEntry {
  short: string;
  full: string;
}

export interface TranslationDescriptions {
  // Infinite despair subtypes
  infinite: {
    imagination: DescriptionEntry;
    cognition: DescriptionEntry;
    feeling: DescriptionEntry;
    will: DescriptionEntry;
  };

  // Finite despair subtypes
  finite: {
    conformist: DescriptionEntry;
    prudent: DescriptionEntry;
  };

  // Possibility despair subtypes
  possibility: {
    combinatorial: DescriptionEntry;
    paralyzed: DescriptionEntry;
  };

  // Necessity despair subtypes
  necessity: {
    fatalist: DescriptionEntry;
    determinist: DescriptionEntry;
  };

  // Consciousness levels
  consciousness: {
    unconscious: DescriptionEntry;
    semiconscious: DescriptionEntry;
    conscious: DescriptionEntry;
  };

  // Unawareness subtypes
  unawareness: {
    naive: DescriptionEntry;
    busy: DescriptionEntry;
    denial: DescriptionEntry;
  };

  // Awareness subtypes
  awareness: {
    suffering: DescriptionEntry;
    defiant: DescriptionEntry;
  };

  // Stage descriptions
  stages: {
    aesthetic: {
      base: DescriptionEntry;
      subtypes: {
        sensual: DescriptionEntry;
        romantic: DescriptionEntry;
        intellectual: DescriptionEntry;
      };
    };
    ethical: {
      base: DescriptionEntry;
      subtypes: {
        civic: DescriptionEntry;
        heroic: DescriptionEntry;
      };
    };
    religious: {
      base: DescriptionEntry;
      subtypes: {
        immanent: DescriptionEntry;
        paradoxical: DescriptionEntry;
      };
    };
  };
}

export interface Translation {
  strings: TranslationStrings;
  descriptions: TranslationDescriptions;
}
