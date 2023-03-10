import { reactive } from '@nuxtjs/composition-api';
import { Category } from '~/domain/models/tasks/category';

// A hook that returns an object with functions to manage teacher list state
export const useTeacherList = (repository: any) => {
  // Define the reactive state
  const state = reactive({
    teacherList: []
  });

  // Fetches the teacher list from the repository and sets it in the state
  const getTeacherList = async (projectId: string, exampleId: number) => {
    state.teacherList = await repository.list(projectId, exampleId);
  };

  // Removes a teacher from the teacher list and updates the state
  const removeTeacher = async (projectId: string, exampleId: number, teacherId: number) => {
    await repository.delete(projectId, exampleId, teacherId);
    await getTeacherList(projectId, exampleId);
  };

  // Creates a new label with the given labelId and updates the teacher list state
  const annotateLabel = async (projectId: string, exampleId: number, labelId: number) => {
    const category = Category.create(labelId);
    await repository.create(projectId, exampleId, category);
    await getTeacherList(projectId, exampleId);
  };

  // Removes all teachers from the teacher list and updates the state
  const clearTeacherList = async (projectId: string, exampleId: number) => {
    await repository.clear(projectId, exampleId);
    await getTeacherList(projectId, exampleId);
  };

  // Automatically labels the teacher list and updates the state
  const autoLabel = async (projectId: string, exampleId: number) => {
    await repository.autoLabel(projectId, exampleId);
    await getTeacherList(projectId, exampleId);
  };

  // Either removes the label from the teacher list or adds it and updates the state
  const annotateOrRemoveLabel = async (projectId: string, exampleId: number, srcKey: string) => {
    const labelId = parseInt(srcKey, 10);
    // Find the annotation with the given labelId
    // @ts-ignore
    const annotation = state.teacherList.find((item) => item.label === labelId);
    if (annotation) {
      // If the annotation exists, remove it from the teacher list
      // @ts-ignore
      await removeTeacher(projectId, exampleId, annotation.id);
    } else {
      // Otherwise, add the label to the teacher list
      await annotateLabel(projectId, exampleId, labelId);
    }
  };

  // Return an object with the state and functions to manage it
  return {
    state,
    getTeacherList,
    annotateLabel,
    annotateOrRemoveLabel,
    removeTeacher,
    clearTeacherList,
    autoLabel
  };
};
