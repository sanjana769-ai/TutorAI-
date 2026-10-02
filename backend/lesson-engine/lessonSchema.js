const lessonSchema = {
  id: "",
  topic: "",
  subject: "",
  level: "",

  explanation: {
    simple: "",
    detailed: "",
    realWorld: ""
  },

  visual: {
    type: "",
    scene: "",

    objects: [],

    relationships: [],

    interactions: []
  },

  steps: [],

  quiz: []
};

module.exports = lessonSchema;