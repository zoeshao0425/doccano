import { reactive, useContext } from '@nuxtjs/composition-api'
import { Project } from '~/domain/models/project/project'

export const useProjectItem = () => {

  /**
   * Reactive state object containing the current Project object.
   */
  const state = reactive({
    project: {} as Project
  })

  /**
   * Accesses the Nuxt.js context object to retrieve the ProjectApplicationService instance.
   */
  const { app } = useContext()
  const projectService = app.$services.project

  /**
   * Asynchronous function used to fetch a single Project object from the server using the ProjectApplicationService.
   * @param projectId - The ID of the Project to retrieve.
   */
  const getProjectById = async (projectId: string) => {
    state.project = await projectService.findById(projectId)
  }

  // Return an object containing the state and getProjectById function.
  return {
    state,
    getProjectById
  }
}
