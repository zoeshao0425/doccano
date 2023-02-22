<template>
  <div>
    <div class="page-numbers">
      <div class="page-numbers-title">
        <h3>Pages in which "pain" appears:</h3>
      </div>
      <v-list-item-group v-model="selected" mandatory class="page-numbers-container">
        <v-list-item v-for="(page, i) in pageNum" :key="i" 
          :class="{ 'confirmed': page.isConfirmed}"
          @click="selectItem(page)">
          <v-list-item-content class="page-number-content">
            <v-list-item-title class="page-number-text">
              {{ page.id }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </div>

    <div v-if="selectedItem">
      <div>
        <h3>Annotation:</h3>
      </div>
      <div class="annotation-text pa-4">
        <entity-editor 
          :dark="$vuetify.theme.dark" 
          :rtl="isRTL"  
          :text="selectedItem.passage"
          :entities="pans"
          :entity-labels="spanTypes" 
          @addEntity="addSpan" 
          @click:entity="updateSpan" 
          @contextmenu:entity="deleteSpan">
        </entity-editor>
      </div>
        
      <div> 
        <button class="view-button" @click="$router.push('/demo/image-caption')">View Page</button>
      </div>
    </div>
  </div>
</template>

<script>
import EntityEditor from '@/components/tasks/sequenceLabeling/EntityEditor.vue'

export default {
  components: {
    EntityEditor
  },

  props: {
    isProjectAdmin: {
      type: Boolean,
      default: false,
      required: true
    },
    project: {
      type: Object,
      default: () => { },
      required: true
    }
  },
  data() {
    return {
      // The selected page
      // a page item if an item is clicked. Display that item's passage
      // null if no page is selected. Display nothing
      selectedItem: null,
      // wordToHighlight: 'pain',
      // highlightClass: 'highlighted',
      docs: [],
      spans: [],
      categories: [],
      spanTypes: [],
      categoryTypes: [],
      exclusive: false,
      enableAutoLabeling: false,
      progress: {},
    };
  },
  computed: {
    pageNum() {
      const items = [
        {
          id: 1,
          text: "1",
          link: "intent-detection-and-slot-filling/newpage/test",
          isSelected: false,
          isConfirmed: true,
          passage: `Subjective:
            CC: Ms. Williams is a 77 year old female. Established Patient She is here today following a transition of care from the emergency department ( Mercy Medical Center on 03/21/2022 ). She presents with headache Tension. Medications reviewed with patient Per pt, no refills needed. (Walgreens in Atwater) , Consult on pain medicationER REPORT IN DOCMAN
            HPI:
            Ms. Williams presents in follow up from ER. She was seen in the ER on 03/21/2022.
            Patient was admitted to the hospital due to (FALL)
            Diagnosis on Discharge: Closed Head Injury (S09.90XA) Scalp laceration (S01.01XA), Fall (W19.XXXA) No labs were done.
            The following radiology tests were done: Spine CT: (CT Cervical Spine Without Contrast: Findings: NOrmal craniovertebral junction. Noraml anterio atlantoaxial artculation. NOrmal odontoid process. Noram cervical lordosis. Normal verebral bodies and posterior osseous elements. NO acute fracture or listesis. Moderat multilevel degerative disc disease. Normal visulized soft tissue structures. Impression: Multilevel degerative changes, as described above).
            The following procedures were done: laceration repair on the prosterio scalp
            The patient received Insturctions to follow up with PCP in 1-3 days.
            The patient's course has been stable and nonprogressive.
            It is of moderate intensity. The patient rates her baseline quality of life (prior to diagnosis) as fair. The quality of life
            now since diagnosis is much worse.
            Tension-type headache, unspecified, intractable details; onset was approximately 2 months ago. The location is primarily left and right occipital and behind the eyes. The pain radiates to the left, right, and posterior neck, left and right eye, and bilateral ears. Ms. Williams denies having significant prior headaches. She characterizes it as severe.
            Associated symptoms include chills, nausea, pain with chewing, rhinorrhea, difficulty sleeping and stiff neck. 
            She denies fever, pain in teeth, sinus congestion, vision disturbance, vomiting or watery eyes. The headache is exacerbated with sitting up. It is improved with sitting back on recliner and cold compresses and heat. Pertinent past medical history includes allergies and head injury. She denies a history of migraines, tension headaches, sleep apnea, CNS tumor or CVA.
            Dx with laceration without foreign body of scalp, initial encounter; Ms. Williams presents with a laceration of the scalp. INFECTION? increased pain (other than expected from the injury), but not redness, drainage, injury site warmth, fever or swollen lymph nodes The injury is due to a Per pt, states that she was at a laundromat and she fell on her back, lost conscious at the moment of the fall.. This occurred 03/21/22. She has already staples were applied. Her last Tetanus booster was 11/29/2021.
            ROS:
            CONSTITUTIONAL: Negative for chills and fever.
            CARDIOVASCULAR: Negative for chest pain, palpitations and pedal edema.
            RESPIRATORY: Negative for recent cough, dyspnea and frequent wheezing.
            GASTROINTESTINAL: Negative for abdominal pain, acid reflux symptoms, dysphagia, constipation, diarrhea, nausea
            and vomiting.
            MUSCULOSKELETAL: Negative for arthralgias, myalgias and stiff neck.
            NEUROLOGICAL: Negative for dizziness, headaches, tremor, vertigo, weakness and gait disturbance.
            PSYCHIATRIC: Negative for anxiety and depression.`        
        },
        {
          id: 2,
          text: "2",
          link: "intent-detection-and-slot-filling/newpage/test",
          isSelected: false,
          isConfirmed: true,
          passage: `Current Problems:
            Last Reviewed on 5/24/2022 11:49 AM by Shannon, Arneisha
            Other iron deficiency anemias
            Pure hypercholesterolemia, unspecified
            Low back pain
            Discitis, unspecified, lumbosacral region
            Sleep related leg cramps
            Gastro-esophageal reflux disease without esophagitis
            Iron deficiency anemia secondary to blood loss (chronic)
            Sideropenic dysphagia
            Heberden's nodes (with arthropathy)
            Bouchard's nodes (with arthropathy)
            Rheumatoid arthritis, unspecified
            Chronic kidney disease, stage 3 (moderate)
            Glaucoma with increased episcleral venous pressure, bilateral
            Other asthma
            Type 2 diabetes mellitus without complications
            Insomnia, unspecified
            Nicotine dependence, cigarettes, in remission
            Unspecified disturbances of skin sensation
            Laceration without foreign body of scalp, initial encounter
            Unspecified injury of head, initial encounter
            Encounter for follow-up examination after completed treatment for conditions other than malignant neoplasm
            Tension-type headache, unspecified, intractable
            Immunizations:
            Influenza, high dose seasonal (FLUZONE HIGH-DOSE 2019-2020) 10/22/2019
            influenza, high-dose, quadrivalent (FLUZONE HIGH-DOSE QUAD 2020-21) 11/23/2020
            influenza, high-dose, quadrivalent (FLUZONE HIGH-DOSE QUAD 2021-22) 11/8/2021
            Td (adult), 5 Lf tetanus toxoid, preservative free, adsorbed (TENIVAC) 11/29/2021
            Prevnar 13 (Pneumococcal PCV 13) 11/17/2016
            Fluzone (3 + years dose) 11/8/2018
            Fluzone High-Dose pf (>=65 yr) 11/7/2013
            Fluzone High-Dose pf (>=65 yr) 10/2/2014
            Fluzone High-Dose pf (>=65 yr) 9/1/2016
            Fluzone High-Dose pf (>=65 yr) 9/29/2017
            PNEUMOVAX 23 (Pneumococcal PPV23) 5/14/2009
            Tdap (Tetanus, reduced diph, acellular pertussis) 5/14/2009
            Allergies:
            Last Reviewed on 5/24/2022 11:49 AM by Shannon, Arneisha
            Codeine Phosphate: Anxiousness`,
        },
        {
          id: 3,
          text: "3",
          link: "intent-detection-and-slot-filling/newpage/test",
          isSelected: false,
          isConfirmed: false,
          passage: `Exams:
            GENERAL: well developed, well nourished, in no apparent distress
            EYES: lids and conjunctiva are normal; pupils and irises are normal;
            NECK: Neck is supple with full range of motion;
            RESPIRATORY: normal respiratory rate and pattern with no distress; normal breath sounds with no rales, rhonchi,
            wheezes or rubs;
            CARDIOVASCULAR: normal rate; regular rhythm; no murmurs; no edema or significant varicosities;
            MUSCULOSKELETAL: digits/nails: no clubbing, cyanosis, or evidence of ischemia or infection; gait: slowed and uses cane; grossly normal tone and muscle strength;
            NEUROLOGIC: cranial nerves II-XII grossly intact;
            PSYCHIATRIC: mental status: alert and oriented x 3; appropriate affect and demeanor;
            Assessment:
            M46.47 Discitis, unspecified, lumbosacral region
            E11.9 Type 2 diabetes mellitus without complications
            E78.00 Pure hypercholesterolemia, unspecified
            ORDERS:
            Meds Prescribed:
            [Refilled] traMADol 50 mg oral tablet [take 1 tablet (50 mg) by oral route every 12 hours as needed], #30 (thirty)
            tablets, Refills: 0 (zero)
            Lab Orders:
            MLIS Hemoglobin; glycosylated (A1C) (In-House)
            MLIS Basic metabolic panel (Calcium, total). This panel must include the following: Calcium (82310), Carbon dioxide (82374), Chloride (82435), Creatinine (82565), Glucose (82947), Potassium (84132), Sodium (84295), Urea nitrogen (BUN) (84520) (Send-Out)
            MLIS Microalbumin, semiquantitative (In-House)
            MLIS Alanine amino transferase (Send-Out)
            MLIS Aspartate amino transferase (Send-Out)
            MLIS Lipid panel (total cholesterol, HDL, triglycerides) (Send-Out)
            MLIS Low density lipoprotein assay (Send-Out)
            Procedures Ordered:
            Collection of venous blood by venipuncture (In-House)
            Other Orders:
            Advance care planning dicussed with patient, first 30 min (In-House)
            TB Risk Assessment (Send-Out)
            Non-Fasting (In-House)

            Plan:
            Discitis, unspecified, lumbosacral regionUnder care of Dr. Miranda at MFA
            Prescriptions:
            [Refilled] traMADol 50 mg oral tablet [take 1 tablet (50 mg) by oral route every 12 hours as needed], #30 (thirty)
            tablets, Refills: 0 (zero)
            Type 2 diabetes mellitus without complications
            LABORATORY: Labs ordered to be performed today include venipuncture, Non Fasting, HgbA1C Basic
            Metabolic Panel urine microalbumin, and ALT AST Lipid panel LDL.
            Orders:
            36415 Collection of venous blood by venipuncture (In-House)
            FASTNON Non-Fasting (In-House)
            83036 MLIS Hemoglobin; glycosylated (A1C) (In-House)
            80048 MLIS Basic metabolic panel (Calcium, total). This panel must include the following: Calcium (82310), Carbon
            dioxide (82374), Chloride (82435), Creatinine (82565), Glucose (82947), Potassium (84132), Sodium (84295), Urea
            nitrogen (BUN) (84520) (Send-Out)
            82044 MLIS Microalbumin, semiquantitative (In-House)
            84460 MLIS Alanine amino transferase (Send-Out)
            84450 MLIS Aspartate amino transferase (Send-Out)
            80061 MLIS Lipid panel (total cholesterol, HDL, triglycerides) (Send-Out)
            83721 MLIS Low density lipoprotein assay (Send-Out)
            Patient Education Handouts:
            Non-Insulin Dependent Diabetes Mellitus (NIDDM)
            Pure hypercholesterolemia, unspecified
            Patient Education Handouts:
            Hyperlipidemia (Hyperlipoproteinemia)
            `,
        }
      ];
      return items;
    }
  },
  methods: {
    savePage(){
      this.$router.push('/demo/image-caption')
    },
    
    // not using this method right now
    textToDisplay() {
    const passageToHighlight = this.selectedItem.passage
    const highlighted = passageToHighlight.replace(/pain/gi, '<span class="highlighted">pain</span>');
    return highlighted;
    },

    selectItem(item) {
      // If clicked on a new item without unclicking the old item, set 
      // isSelected = false for the old item
      if (this.selectedItem != null && this.selectedItem !== item) {
        this.selectedItem.isSelected = false
      }
      
      item.isSelected = !item.isSelected

      // update the selected item
      if (item.isSelected) {
        this.selectedItem = item
      } else {
        this.selectedItem = null
      }
    },


    async listSpan(docId) {
      const spans = await this.$services.sequenceLabeling.list(this.projectId, docId)
      this.spans = spans
    },

    async deleteSpan(id) {
      await this.$services.sequenceLabeling.delete(this.projectId, this.doc.id, id)
      await this.listSpan(this.doc.id)
    },

    async addSpan(startOffset, endOffset, labelId) {
      await this.$services.sequenceLabeling.create(
        this.projectId,
        this.doc.id,
        labelId,
        startOffset,
        endOffset
      )
      await this.listSpan(this.doc.id)
    },

    async updateSpan(annotationId, labelId) {
      await this.$services.sequenceLabeling.changeLabel(
        this.projectId,
        this.doc.id,
        annotationId,
        labelId
      )
      await this.listSpan(this.doc.id)
    },

    async listCategory(id) {
      this.categories = await this.$services.textClassification.list(this.projectId, id)
    },

    async removeCategory(id) {
      await this.$services.textClassification.delete(this.projectId, this.doc.id, id)
      await this.listCategory(this.doc.id)
    },

    async addCategory(labelId) {
      await this.$services.textClassification.create(this.projectId, this.doc.id, labelId)
      await this.listCategory(this.doc.id)
    },

    async addOrRemoveCategory(event) {
      const labelId = parseInt(event.srcKey, 10)
      const category = this.categories.find((item) => item.label === labelId)
      if (category) {
        await this.removeCategory(category.id)
      } else {
        await this.addCategory(labelId)
      }
    },

    async clear() {
      await this.$services.sequenceLabeling.clear(this.projectId, this.doc.id)
      await this.listSpan(this.doc.id)
    },

    async autoLabel(docId) {
      try {
        await this.$services.sequenceLabeling.autoLabel(this.projectId, docId)
      } catch (e) {
        console.log(e.response.data.detail)
      }
    },

    async updateProgress() {
      this.progress = await this.$services.metrics.fetchMyProgress(this.projectId)
    },

    async confirm() {
      await this.$services.example.confirm(this.projectId, this.doc.id)
      await this.$fetch()
      this.updateProgress()
    }
  }
}
</script>

<style scoped>
.annotation-text {
  font-size: 1.25rem !important;
  font-weight: 500;
  line-height: 2rem;
  font-family: 'Roboto', sans-serif !important;
  opacity: 0.6;
  flex: 1;
}

.nav-pills>li>a {
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
}

.page-numbers {
  margin-bottom: 25px;
}

.page-numbers-title {
  margin-bottom: 10px;
}

.page-numbers-container {
  display: grid;
  grid-template-columns: repeat(15, 36px);
  row-gap: 10px;
  list-style: none;
}

.page-number-content {
  padding: 0 0;
  
}

.page-number-text {
  color: black;
  display: flex;
  justify-content: center;
  font-size: 16px;
}

.v-list-item {
  padding: 0 0;
  min-height: 36px;
  background-color: rgb(244, 186, 186)
}

.confirmed {
  background-color: rgb(185, 244, 197)
}
.view-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.highlighted {
  background-color: yellow;
  color: blue;
}

</style>

