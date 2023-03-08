## Metrics

This folder contains three Vue.js components that are responsible for 
displaying different types of metrics for the Doccano annotation tool.

## LabelDistributions.vue

This component is used to display the distribution of labels across 
all annotations for a given project. It takes in a distribution object 
and an array of labelTypes as props and generates a bar chart for each 
user with their label distribution data.

# Props
title (String, required): The title of the component.
distribution (Object, required): The label distribution data for each user.
labelTypes (Array, required): The array of label types for the project.


## MemberProgress.vue

This component is used to display the progress of each member in a project. 
It takes in a stats object as a prop and displays the progress of each user 
in a progress bar.

# Props
None

# Data
stats: An object that contains the progress data for each member.

## AnnotationDensity.vue

This component is used to display the annotation density for a project. 
It takes in a density object as a prop and displays the number of annotations 
for each day in a line chart.

# Props
density (Object, required): The annotation density data for the project.