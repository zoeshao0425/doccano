import { reactive } from '@nuxtjs/composition-api'
import { Category } from '~/domain/models/tasks/category'

export const useTeacherList = (repository: any) => {

  /**
   * Reactive state object containing the list of teachers.
   */
  const state = reactive({
    teacherList: []
  })

  /**
   * Asynchronous function used to fetch the list of teachers from the server using the specified repository.
   * @param projectId - The ID of the project to retrieve the list of teachers for.
   * @param exampleId - The ID of the example to retrieve the list of teachers for.
   */
  const getTeacherList = async (projectId: string, exampleId: number) => {
    state.teacherList = await repository.list(projectId, exampleId)
  }

  /**
   * Asynchronous function used to remove a teacher from the list using the specified repository.
   * @param projectId - The ID of the project to remove the teacher from.
   * @param exampleId - The ID of the example to remove the teacher from.
   * @param teacherId - The ID of the teacher to remove.
   */
  const removeTeacher = async (projectId: string, exampleId: number, teacherId: number) => {
    await repository.delete(projectId, exampleId, teacherId)
    await getTeacherList(projectId, exampleId)
  }

  /**
   * Asynchronous function used to annotate a label on an example using the specified repository.
   * @param projectId - The ID of the project to annotate the label for.
   * @param exampleId - The ID of the example to annotate the label for.
   * @param labelId - The ID of the label to annotate.
   */
  const annotateLabel = async (projectId: string, exampleId: number, labelId: number) => {
    const category = Category.create(labelId)
    await repository.create(projectId, exampleId, category)
    await getTeacherList(projectId, exampleId)
  }

  /**
   * Asynchronous function used to clear the list of teachers for an example using the specified repository.
   * @param projectId - The ID of the project to clear the teacher list for.
   * @param exampleId - The ID of the example to clear the teacher list for.
   */
  const clearTeacherList = async (projectId: string, exampleId: number) => {
    await repository.clear(projectId, exampleId)
    await getTeacherList(projectId, exampleId)
  }

  /**
   * Asynchronous function used to automatically label an example using the specified repository.
   * @param projectId - The ID of the project to auto-label the example for.
   * @param exampleId - The ID of the example to auto-label.
   */
  const autoLabel = async (projectId: string, exampleId: number) => {
    await repository.autoLabel(projectId, exampleId)
    await getTeacherList(projectId, exampleId)
  }

  /**
   * Asynchronous function used to annotate or remove a label on an example using the specified repository.
   * @param projectId - The ID of the project to annotate or remove the label for.
   * @param exampleId - The ID of the example to annotate or remove the label for.
   * @param srcKey - The source key of the label to annotate or remove.
   */
  const annotateOrRemoveLabel = async (projectId: string, exampleId: number, srcKey: string) => {
    const labelId = parseInt(srcKey, 10)
    // @ts-ignore
    const annotation = state.teacherList.find((item)
