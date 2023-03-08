// Importing required dependencies and types from external modules.
import { computed, reactive } from '@nuxtjs/composition-api'
import { LabelDTO } from '@/services/application/label/labelData'
import { CreateLabelCommand, UpdateLabelCommand } from '@/services/application/label/labelCommand'
import { LabelApplicationService } from '@/services/application/label/labelApplicationService'

// Defining a custom Vue Composition API hook to handle label list related actions and state.
export const useLabelList = (service: LabelApplicationService) => {

  // Defining a reactive state object with a single property `labels` which is an array of LabelDTO objects.
  const state = reactive({
    labels: [] as LabelDTO[]
  })

  // Defining an asynchronous function to retrieve label list by project ID and update `labels` state property.
  const getLabelList = async (projectId: string) => {
    state.labels = await service.list(projectId)
  }

  // Defining an asynchronous function to create a new label with provided command and update `labels` state property.
  const createLabel = async (projectId: string, command: CreateLabelCommand) => {
    await service.create(projectId, command)
    await getLabelList(projectId)
  }

  // Defining an asynchronous function to update a label with provided command.
  const updateLabel = async (projectId: string, command: UpdateLabelCommand) => {
    await service.update(projectId, command)
  }

  // Defining an asynchronous function to delete multiple labels with provided items array and update `labels` state property.
  const deleteLabelList = async (projectId: string, items: LabelDTO[]) => {
    await service.bulkDelete(projectId, items)
    await getLabelList(projectId)
  }

  // Defining a function to find and return a label object from `labels` state property by ID.
  const findLabelById = (labelId: number) => {
    return state.labels.find((item) => item.id === labelId)
  }

  // Defining a computed property `shortKeys` which is an object containing suffix keys of all labels mapped to their respective label IDs.
  const shortKeys = computed(() => {
    return Object.fromEntries(state.labels.map((item) => [item.id, [item.suffixKey]]))
  })

  // Returning an object containing `state`, `getLabelList`, `findLabelById`, `createLabel`, `updateLabel`, `deleteLabelList` and `shortKeys` as its properties.
  return {
    state,
    getLabelList,
    findLabelById,
    createLabel,
    updateLabel,
    deleteLabelList,
    shortKeys
  }
}
