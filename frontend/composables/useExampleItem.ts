<<<<<<< HEAD
import { reactive } from '@nuxtjs/composition-api';
import { Category } from '~/domain/models/tasks/category';
import _ from 'lodash'
=======
// Importing reactive and useContext from @nuxtjs/composition-api, lodash and ExampleDTO from '@/services/application/example/exampleData'
import { reactive, useContext } from '@nuxtjs/composition-api'
import _ from 'lodash'
import { ExampleDTO } from '@/services/application/example/exampleData'
>>>>>>> 351669c3 (Added comments)

// A function that returns an object with the methods to handle example items.
export const useExampleItem = () => {
  
  // Creating a reactive state object that stores example data.
  const state = reactive({
    example: {} as ExampleDTO,
    totalExample: 0,
    progress: {}
  })

  // Destructuring app from the result of calling useContext.
  const { app } = useContext()

  // Assigning exampleService to the result of accessing app.$services.example.
  const exampleService = app.$services.example

  /* 
   * A function that fetches example data given a projectId and a set of parameters.
   * @param projectId: string - ID of the project.
   * @param { page: string; q: string; isChecked: string; ordering: string } - Object with query parameters.
   */
  const getExample = async (
    projectId: string,
    {
      page,
      q,
      isChecked,
      ordering
    }: { page: string; q: string; isChecked: string; ordering: string }
  ) => {
    // Fetching example data using the exampleService.
    const examples = await exampleService.fetchOne(projectId, page, q, isChecked, ordering)
    // Updating the totalExample property in the state object with the count of the examples.
    state.totalExample = examples.count
    // If examples is not empty and has items, updating the example property in the state object with the first item.
    if (!_.isEmpty(examples) && examples.items.length !== 0) {
      state.example = examples.items[0]
    }
  }

  /* 
   * A function that fetches a single example item by its ID.
   * @param projectId: string - ID of the project.
   */
  const getExampleById = async (projectId: string) => {
    // Updating the example property in the state object with the result of calling findById on the exampleService using the projectId and the example ID from the state object.
    state.example = await exampleService.findById(projectId, state.example.id)
  }

  /* 
   * A function that updates the progress property in the state object.
   * @param projectId: string - ID of the project.
   */
  const updateProgress = async (projectId: string) => {
    // Updating the progress property in the state object with the result of calling fetchMyProgress on the app.$repositories.metrics using the projectId.
    state.progress = await app.$repositories.metrics.fetchMyProgress(projectId)
  }

  /* 
   * A function that confirms an example item.
   * @param projectId: string - ID of the project.
   */
  const confirm = async (projectId: string) => {
    // Calling the confirm method on the exampleService using the projectId and the example ID from the state object.
    await exampleService.confirm(projectId, state.example.id)
    // Updating the example property in the state object with the result of calling getExampleById with the projectId.
    await getExampleById(projectId)
    // Calling updateProgress with the projectId to update the progress property in the state object.
    updateProgress(projectId)
  }

  // Returning an object with the state object and the methods confirm, getExample, and updateProgress.
  return {
    state,
    confirm,
    getExample,
    updateProgress
  }
} 
