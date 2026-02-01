import type { Translation } from '../types';

export const en: Translation = {
  strings: {
    appTitle: 'Despair Space',
    appSubtitle: "Kierkegaard's 3D Visualizer",

    characters: {
      noCharacters: 'No characters',
      createFirst: 'Create your first character',
      addCharacter: 'Add Character',
      editCharacter: 'Edit Character',
      deleteCharacter: 'Delete Character',
      confirmDelete: 'Delete this character?',
      name: 'Name',
      namePlaceholder: 'Character name',
      color: 'Color',
      points: 'points',
      connections: 'connections',
      hide: 'Hide',
      show: 'Show',
      export: 'Export',
      import: 'Import',
      importSuccess: 'Character imported successfully',
      importError: 'Import error',
      copyPrompt: 'Copy Prompt',
      promptCopied: 'Copied!',
      loadExample: 'Load example:',
    },

    characterCore: {
      history: 'Key Events',
      historyPlaceholder: 'Key event from the past',
      addEvent: 'Add Event',
      body: 'Physical Description',
      bodyPlaceholder: 'Appearance, physicality',
      gift: 'Gift/Talent',
      giftPlaceholder: 'Special ability or talent',
    },

    points: {
      selectCharacterFirst: 'Select a character first',
      addPoint: 'Add Point',
      editPoint: 'Edit Point',
      deletePoint: 'Delete Point',
      confirmDelete: 'Delete this point?',
      momentName: 'Moment Name (optional)',
      momentNamePlaceholder: 'E.g.: Before the murder',
      coordinates: 'Coordinates in Space',
      shortLabel: 'Short Label',
      labelPlaceholder: 'Brief state description',
      detailedDescription: 'Detailed Description',
      descriptionPlaceholder: 'Custom description (optional, procedural will be auto-generated)',
      generate: 'Generate',
      save: 'Save',
      create: 'Create Point',
      setAsRoot: 'Set as Root',
      isRoot: 'Root Point',
      viewDetails: 'View Details',
      viewPath: 'View Path',
    },

    connections: {
      connect: 'Connect',
      cancelConnect: 'Cancel',
      selectTarget: 'Select target point',
      editConnection: 'Edit Connection',
      deleteConnection: 'Delete Connection',
      confirmDelete: 'Delete this connection?',
      transitionType: 'Transition Type',
      crisis: 'Crisis',
      crisisTrigger: 'Crisis Trigger',
      crisisTriggerPlaceholder: 'What triggered the crisis?',
      alternatives: 'Alternatives (one per line)',
      alternativesPlaceholder: 'What other options were there?',
      addAlternative: 'Add Alternative',
      unknownTrigger: 'Unknown trigger',
      evolutionHint: 'Evolution — gradual transition, smooth development of state',
      crisisHint: 'Crisis — sharp turning point caused by a specific event',
      branchHint: 'Branch — alternative path of character development',
    },

    transitionTypes: {
      evolution: 'Evolution',
      crisis: 'Crisis',
      branch: 'Branch',
    },

    stages: {
      title: 'Stage of Existence',
      aesthetic: 'Aesthetic',
      ethical: 'Ethical',
      religious: 'Religious',
    },

    stageSubtypes: {
      sensual: 'Sensual',
      romantic: 'Romantic',
      intellectual: 'Intellectual',
      civic: 'Civic',
      heroic: 'Tragic Hero',
      immanent: 'Immanent',
      paradoxical: 'Paradoxical',
    },

    axes: {
      finiteInfinite: 'Finite ↔ Infinite',
      finite: 'Finite',
      infinite: 'Infinite',
      necessityPossibility: 'Necessity ↔ Possibility',
      necessity: 'Necessity',
      possibility: 'Possibility',
      consciousness: 'Consciousness',
      unawareness: 'Unawareness',
      awareness: 'Awareness',
      balance: 'Balance',
      semiconscious: 'Semi-conscious',
    },

    axisSubtypes: {
      despairOfInfinity: 'Despair of Infinity',
      despairOfFinitude: 'Despair of Finitude',
      despairOfPossibility: 'Despair of Possibility',
      despairOfNecessity: 'Despair of Necessity',
      unawarenessTitle: 'Unawareness',
      awarenessTitle: 'Awareness',
      coordinateAbove: 'Coordinate > 60%',
      coordinateBelow: 'Coordinate < 40%',
      imagination: 'Fantasy',
      cognition: 'Cognition',
      feeling: 'Abstract Feelings',
      will: 'Grand Plans',
      conformist: 'Conformist',
      prudent: 'Prudence',
      combinatorial: 'Combinatorial',
      paralyzed: 'Paralyzed',
      fatalist: 'Fatalist',
      determinist: 'Determinist',
      naive: 'Naive',
      busy: 'Busy',
      denial: 'Denial',
      suffering: 'Suffering',
      defiant: 'Defiant',
    },

    salvationPoint: {
      title: 'Point of Salvation',
      description: 'Religious stage with high awareness — this is not despair, but its overcoming',
    },

    labels: {
      dreamerUnknowing: 'Dreamer unaware of self',
      reflectionDevours: 'Reflection devours action',
      grandPlansInFog: 'Grand plans in the fog',
      polishedPebble: 'Polished pebble of the crowd',
      knowsCageAccepted: 'Knows the cage, accepted it',
      vaguelyFeelsWalls: 'Vaguely feels the walls',
      fatalistGrandIdeas: 'Fatalist with grand ideas',
      knowsUselessness: 'Knows the futility of dreams',
      conformistPlaying: 'Conformist playing with options',
      seesExitsFears: 'Sees exits, fears to leave',
      lostInAbstractions: 'Lost in abstractions',
      awaresDetachment: 'Aware of detachment',
      dissolvedInWorld: 'Dissolved in the world',
      knowsLimitations: 'Knows own limitations',
      floatsInPossibilities: 'Floats in possibilities',
      awaresChoiceParalysis: 'Aware of choice paralysis',
      acceptedFateUnthinking: 'Accepted fate unthinkingly',
      consciousDeterminist: 'Conscious determinist',
      awaresOwnDespair: 'Aware of own despair',
      unawareOfIllness: 'Unaware of the illness',
      vagueAnxiety: 'Vague anxiety',
      stageLabel: 'stage',
    },

    pathDetail: {
      title: 'Path to Point',
      noPath: 'No path (not connected to root)',
      rootPoint: 'Root Point',
      pathToPoint: 'Path to Point',
      step: 'Step',
      via: 'via',
      authorDescription: "Author's Description",
      stateAnalysis: 'State Analysis',
    },

    pointDetail: {
      stage: 'Stage',
      coordinates: 'Coordinates',
      close: 'Close',
    },

    actions: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      back: 'Back',
    },

    settings: {
      language: 'Language',
    },

    shortcuts: {
      leftClick: 'Left click — rotate',
      rightClick: 'Right click — pan',
      scroll: 'Scroll — zoom',
      clickPoint: 'Click point — select',
      doubleClick: 'Double click — details',
      shiftClick: 'Shift+click point — connect',
      clickConnection: 'Click connection — edit',
      shiftClickToConnect: 'Shift+click to connect',
      doubleClickForPath: 'Double click on point — view path',
    },

    presets: {
      raskolnikov: {
        name: 'Raskolnikov',
        core: {
          history: [
            'Impoverished noble family',
            'Loving mother who sacrifices herself',
            'Sister Dunya — beautiful, proud',
            'Was a brilliant student',
            'Dropped out of university due to poverty',
            'Months in a coffin-like garret',
          ],
          body: 'Handsome, tall, dark eyes. Emaciated, sickly.',
          gift: 'Intellect, capacity for theory, pride',
        },
        points: {
          r1: {
            momentName: 'Before the murder',
            label: 'Lives in an idea, blind to himself',
            description: `The theory of the "extraordinary man" has replaced reality. The old woman is not a person but a symbol, a "louse." He is not a murderer — he is an experimenter. The idea has so consumed him that the concrete (blood, axe, face) seems irrelevant. He doesn't know he is already in despair.

Accumulation of knowledge without application to one's own life. Can explain the structure of the universe but doesn't know how to live. Cognition becomes a way to avoid the existential question.

The most dangerous form of despair — because it is invisible. A person may be quite satisfied with life. They don't ask "who am I?" — and therefore cannot get an answer.`,
          },
          r2: {
            momentName: 'After the murder',
            label: 'Reality breaks in',
            description: `The idea collided with blood — and cracked. Lizaveta was not in the plan. The old woman turned out to be not a "louse" but a person with a face. He is frantic, feverish. Something is wrong — but he doesn't yet understand what. He begins to realize he is sick, but makes the wrong diagnosis.

Sees the void — and finds a perverse pleasure in it. "I am a sick man, I am an evil man." Aware of his despair but clings to it as the last thing he has.

Sees the illness — but doesn't know the cure. Or knows it but doesn't want to take it.`,
          },
          r3: {
            momentName: 'Meeting Sonya',
            label: 'Sees another person for the first time',
            description: `Sonya is a mirror. In her presence the theory crumbles. She too has "transgressed" — but for others. He begins to distinguish: killing an idea is one thing, killing a person is another. For the first time he asks not "do I have the right?" but "who am I?"

Sacrifices himself for the higher — the people, an idea, duty. But he remains within the universal — he has not yet made the leap of faith.

Aware of his despair in its fullness. This is agonizing honesty.`,
          },
          r4: {
            momentName: 'Confession',
            label: 'Accepts guilt',
            description: `Goes to the police. Not because he fears punishment — because he can no longer bear the burden. Confession is the first act of authentic choice. He chooses not the idea but himself. Chooses to be guilty — and thus to be human.

God is known through deepening into oneself. Suffering is the path to God. A person dies to the world, renounces the finite.

Full awareness of one's condition and choice.`,
          },
          r5: {
            momentName: 'Prison (beginning)',
            label: 'Accepted punishment but not repentant',
            description: `In prison he is still proud. Admits guilt legally but not existentially. "The only thing he admitted as his crime was simply that he had not borne it and had made a confession." He has not yet repented — only surrendered.

Fulfills obligations, bears punishment. But inwardly still resists.

Awareness drops — he walls himself off from full understanding.`,
          },
          r6: {
            momentName: 'Prison (transfiguration)',
            label: 'Leap of faith',
            description: `Illness, dream of the plague, awakening. Sees Sonya — and something breaks. "Instead of dialectics, life had come." He doesn't understand with his mind — he simply falls at her feet. This is not logic, it is a leap. The Gospel under his pillow. Seven years — like seven days.

Leap of faith through the absurd. The eternal entered time. Faith is not knowledge but a risky "yes."

Full awareness with full acceptance of the paradox of faith.`,
          },
        },
        connections: {
          c1: {
            trigger: 'The murder',
            alternatives: ['Become Napoleon', 'Break down'],
          },
          c3: {
            trigger: "Sonya's love",
            alternatives: ['Suicide', 'Flight'],
          },
          c5: {
            trigger: 'Illness and dream',
            alternatives: ['Harden in pride'],
          },
        },
      },
    },
  },

  descriptions: {
    infinite: {
      imagination: {
        short: 'Lost in fantasies',
        full: `The real self has disappeared, replaced by a phantom. A person may imagine themselves as a great artist, savior of the world, tragic hero — but in reality does nothing. Fantasy becomes a refuge from the concreteness of existence. The brighter the inner world, the paler the real life.`,
      },
      cognition: {
        short: 'Knows everything except self',
        full: `Accumulation of knowledge without application to one's own life. Can explain the structure of the universe but doesn't know how to live. Knowledge becomes a way to avoid the existential question. "The more one knows, the less one knows oneself" — knowledge of the world replaces self-knowledge.`,
      },
      feeling: {
        short: 'Loves humanity, can\'t stand people',
        full: `Feelings become abstract. A person may weep over the fate of distant nations but be irritated by a specific neighbor. Love for "humanity" is a way to avoid loving one's neighbor. Emotions are directed at ideas, not real people.`,
      },
      will: {
        short: 'Grand plans, zero action',
        full: `The will is directed toward infinite projects that will never be realized. Each plan is grander than the last — and each remains in the head. Concrete action seems too small for such grand designs.`,
      },
    },

    finite: {
      conformist: {
        short: 'Does what everyone does',
        full: `Complete adaptation to the environment. A person doesn't risk being themselves — too dangerous to stand out. They copy neighbors, follow fashion, repeat common opinions. The world calls this "health" and "socialization." But they have lost themselves.`,
      },
      prudent: {
        short: 'Narrow prudence',
        full: `Life reduced to calculating benefit and avoiding risk. No impulses, no leaps. "Prudence" becomes a prison where every step is weighed and safe — and where there's no room for anything authentic.`,
      },
    },

    possibility: {
      combinatorial: {
        short: 'Combinatorial fantasies',
        full: `Possibilities multiply infinitely. Each choice opens ten new options. A person never chooses anything definitively — for choice closes other doors. They shuffle combinations instead of living.`,
      },
      paralyzed: {
        short: 'Paralysis from excess options',
        full: `Abundance of possibilities engulfs. The more options, the harder to choose. Eventually the person can't make even the simplest choice — each seems either insufficient or too risky.`,
      },
    },

    necessity: {
      fatalist: {
        short: 'Everything is predetermined',
        full: `"What's the use of trying — everything is already decided." A person surrenders to fate, destiny, circumstances. They don't see that with God everything is possible. Necessity has become absolute — and choked all hope.`,
      },
      determinist: {
        short: 'Scientific inevitability',
        full: `"We are products of genes and environment." A person explains everything by cause-and-effect chains and leaves no room for freedom. They may be intellectually sophisticated — but existentially dead. Everything is explained, therefore — nothing can be changed.`,
      },
    },

    consciousness: {
      unconscious: {
        short: "Doesn't know they're sick",
        full: `The most dangerous form of despair — because it's invisible. A person may be quite satisfied with life. They don't ask "who am I?" — and therefore can't get an answer. Their despair is deeper than that of one who suffers.`,
      },
      semiconscious: {
        short: 'Vague anxiety',
        full: `Something is wrong, but unclear what. Periodically melancholy and meaninglessness wash over. The person drowns this in work, entertainment, relationships — but the anxiety returns. They're on the threshold of awareness — and afraid to cross.`,
      },
      conscious: {
        short: 'Knows their despair',
        full: `Sees the illness — but doesn't know the cure. Or knows it but doesn't want to take it. This can be agonizing honesty — or demonic stubbornness. Awareness without faith — this is hell on earth.`,
      },
    },

    unawareness: {
      naive: {
        short: 'Naive unawareness',
        full: `Blissful ignorance. A person simply doesn't suspect the existence of the problem. Lives as they breathe, without asking questions about meaning. This is not a choice — it's the absence of choice. Perhaps the most comfortable and most dangerous position.`,
      },
      busy: {
        short: 'Busyness as escape',
        full: `Tasks, projects, duties fill every minute. No time to think — must act. But behind this bustle hides the fear of stopping and looking the void in the eye. Busyness is anesthesia from existential pain.`,
      },
      denial: {
        short: 'Active denial',
        full: `Knows but refuses to see. When truth knocks on the door — locks it from inside. This is not innocent ignorance but a choice not to know. The person feels the abyss nearby — and turns away, pretending it doesn't exist.`,
      },
    },

    awareness: {
      suffering: {
        short: 'Suffering awareness',
        full: `Sees the truth — and it causes pain. Despair has become explicit, can no longer be hidden. The person suffers, but in this suffering there is honesty. Suffering can become a door to transformation — or a prison without exit.`,
      },
      defiant: {
        short: 'Defiant awareness',
        full: `Knows the truth — and challenges it. Stubbornly holds onto their despair as the last possession. "I will suffer in my own way!" Pride doesn't allow accepting help, even if it exists. Demonic self-assertion in negation.`,
      },
    },

    stages: {
      aesthetic: {
        base: {
          short: 'Lives for the moment',
          full: `The highest value is the interesting, pleasant, new. The aesthete avoids choice because choice closes possibilities. They glide on the surface of life, collecting impressions. Boredom is their main enemy.`,
        },
        subtypes: {
          sensual: {
            short: 'Sensual aesthete',
            full: `Don Juan: the pursuit of pleasure. Each new pleasure must be stronger than the last. But the law of diminishing returns is relentless — and emptiness awaits at the end.`,
          },
          romantic: {
            short: 'Romantic dreamer',
            full: `Lives in a world of imagination. Reality is too crude for their refined soul. They're in love with the idea of love, enchanted by the idea of adventure — but concrete love, concrete adventure disappoints them.`,
          },
          intellectual: {
            short: 'Intellectual aesthete',
            full: `Delights in ideas, theories, systems. Life is a spectacle they observe from an ironic distance. They're too clever to believe in anything, too insightful to do anything.`,
          },
        },
      },
      ethical: {
        base: {
          short: 'Lives by duty',
          full: `The highest value is constancy, commitment, choice. The ethical person chooses themselves, accepts responsibility, builds life on a foundation of decisions. But the ethical is not yet the religious. One can be respectable and be in despair.`,
        },
        subtypes: {
          civic: {
            short: 'Civic duty',
            full: `Honest, reliable, fulfills obligations to society. The world considers them a model citizen. But they don't ask about God — ethics has replaced religion for them. They think they'll save themselves by their own strength. This is despair.`,
          },
          heroic: {
            short: 'Tragic hero',
            full: `Sacrifices themselves for the higher — the people, an idea, duty. Agamemnon sacrifices Iphigenia. The hero is understandable, their motives transparent. But they remain within the universal — they are not Abraham.`,
          },
        },
      },
      religious: {
        base: {
          short: 'Lives before God',
          full: `The highest value is the relationship with the Absolute. The religious person understands that ethics is insufficient, that one cannot save oneself by one's own strength. They stand before God — one on one, without intermediaries.`,
        },
        subtypes: {
          immanent: {
            short: 'Immanent religiosity',
            full: `God is known through deepening into oneself. Suffering is the path to God. A person dies to the world, renounces the finite. This is not yet Christianity — this could be Socrates.`,
          },
          paradoxical: {
            short: 'Paradoxical faith',
            full: `The leap of faith through the absurd. Abraham believes he will get Isaac back — against all logic. The eternal entered time, God became human — a scandal for reason. Faith is not knowledge but a risky "yes."`,
          },
        },
      },
    },
  },
};
