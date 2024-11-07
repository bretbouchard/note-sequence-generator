Updated Product Requirements Document (PRD)

Project Overview

We are enhancing our existing Next.js React Three.js application that generates note sequences. The focus is on introducing new functionalities related to note sequences in 2, 4, or 8-bar patterns, incorporating templates that assume repetition. This update aims to expand the application’s capabilities while ensuring compatibility and integration with existing features.

Current Application Overview

The current application allows users to:

	•	Generate note sequences based on key, scale, and optional chord progressions.
	•	Apply probabilities for note degree selection, rhythm patterns, and note lengths.
	•	Use seed numbers for consistent sequence generation.
	•	Visualize sequences using Three.js.
	•	Modify sequences with controls for key, scale, and chord progression.
	•	this does not play audio or have playback 

Update Objectives

	1.	Introduce Bar-Based Note Sequences: Implement note sequences in 2, 4, or 8-bar patterns with templates that assume repetition.
	2.	Enhance Template Functionality: Allow rhythm and note templates to be assigned specific durations and positions within the sequence, with automatic repetition based on their assigned duration.
	3.	Separate Note and Rhythm Templating Systems: Ensure that note and rhythm templates function independently, allowing users to adjust each without affecting the other.
	4.	Exclude Tempo and Swing Adjustments: Temporarily remove tempo and swing features, focusing on note and rhythm generation.

Functional Requirements

1. Bar-Based Note Sequence Patterns

	•	Bar Length Options: Users can select note sequences of 2, 4, or 8 bars in length.
	•	Template Repetition:
	•	Templates are designed to assume repetition over the sequence duration.
	•	Example: A 0.5-bar rhythm template repeats every half-bar throughout the sequence.

2. Template Assignment and Management

	•	Assigning Templates:
	•	Users can assign note and rhythm templates to specific bars or beats within the sequence.
	•	Templates have defined durations (e.g., 0.5 bar, 1 bar) and repeat accordingly.
	•	Dynamic Template Changes:
	•	Introducing a new template at a specific bar overrides previous templates from that point onward.
	•	The system should handle transitions smoothly.
	•	Template Editing:
	•	Users can create, edit, and delete templates.
	•	Changes to templates reflect in real-time within the sequence.

3. Separation of Note and Rhythm Templating Systems

	•	Independent Operation:
	•	The note (pitch) and rhythm (timing) templating systems should function separately.
	•	Adjusting one does not impact the other, providing greater flexibility.
	•	Combining Templates:
	•	The final sequence combines note and rhythm templates.
	•	Ensure synchronization so that notes align correctly with rhythms.

4. Exclusion of Tempo and Swing

	•	Disable Tempo and Swing Features:
	•	Temporarily remove or disable tempo and swing functionalities.
	•	Focus on developing note and rhythm templating features.

5. Seed-Based Repeatability

	•	Consistent Generation:
	•	Maintain the use of seed numbers for repeatable sequence generation.
	•	Separate seeds for note and rhythm templates for precise control.

Technical Requirements

1. Data Structures

Note Templates:

	•	Attributes:
	•	Scale Degrees: An array representing note choices as scale degrees.
	•	Weights/Probabilities: Influence the likelihood of selecting each scale degree.
	•	Repetition Rules: Define duration and start positions for template repetition.

Rhythm Templates:

	•	Attributes:
	•	Durations: An array representing note and rest durations.
	•	Template Duration: Length over which the rhythm pattern repeats.
	•	Repetition Rules: Similar to note templates, specify where and how the rhythm template repeats.

2. Integration with Existing Features

	•	Sequence Generation Logic:
	•	Update existing functions to support bar-based patterns and template repetitions.
	•	Ensure backward compatibility with current functionalities.
	•	User Interface Adjustments:
	•	Add controls for assigning templates to specific bars/beats.
	•	Use numerical inputs for template durations and positions, aligning with existing UI patterns.
	•	Visualization Enhancements:
	•	Update Three.js visualizations to reflect new patterns and repetitions.
	•	Provide clear indicators of template boundaries and repetitions.

3. Template Repetition Logic

	•	Automatic Repetition:
	•	Implement logic to repeat templates based on their durations and positions.
	•	Handle dynamic changes when new templates are introduced.
	•	Overlap and Priority Handling:
	•	Define rules for overlapping templates (e.g., newer templates override previous ones).
	•	Ensure smooth transitions and avoid conflicts.

4. Exclusion of Tempo and Swing

	•	Code Adjustments:
	•	Comment out or temporarily remove tempo and swing-related code.
	•	Ensure the removal does not disrupt existing functionalities.
	•	Future Reintroduction Plan:
	•	Document changes to facilitate re-adding these features later.

Implementation Plan

Phase 1: Analysis and Design

	•	Review Existing Codebase:
	•	Identify areas where new features will integrate with current logic.
	•	Determine necessary modifications and potential impact.
	•	Design Data Models:
	•	Update data structures for templates to accommodate new attributes.

Phase 2: Development

	•	Update Sequence Generation Functions:
	•	Modify functions to support bar-based patterns.
	•	Implement template repetition logic.
	•	Modify User Interface:
	•	Add template assignment controls using numerical inputs.
	•	Ensure UI consistency with existing components.
	•	Enhance Visualization Components:
	•	Update visual elements to display new sequence patterns.
	•	Show template boundaries and repetitions clearly.
	•	Separate Templating Systems:
	•	Refactor code to ensure independent operation of note and rhythm templates.
	•	Disable Tempo and Swing Features:
	•	Comment out or remove related code, maintaining application stability.

Phase 3: Testing

	•	Unit Testing:
	•	Test new functions for correct sequence and template generation.
	•	Integration Testing:
	•	Verify that new features work seamlessly with existing functionalities.
	•	User Acceptance Testing:
	•	Gather feedback to ensure the updates meet user expectations.

Phase 4: Deployment

	•	Documentation:
	•	Update user guides and developer documentation.
	•	Release Updates:
	•	Deploy changes to production.
	•	Monitor for any issues and address them promptly.

Considerations for Integration

	•	Compatibility:
	•	Ensure existing user data and settings remain functional.
	•	Provide data migration if necessary.
	•	User Experience:
	•	Maintain a consistent look and feel.
	•	Provide tooltips or help sections for new features.
	•	Performance:
	•	Optimize new code to prevent any slowdown.

Example Data Structure

{
  "sequenceLength": 8,  // Total bars
  "noteTemplates": [
    {
      "id": "noteTemplate1",
      "scaleDegrees": [1, 2, 3, 4],
      "weights": [1.0, 0.8, 0.6, 0.4],
      "repetition": {
        "startBar": 1,
        "duration": 8  // Repeats every 8 bars
      }
    }
  ],
  "rhythmTemplates": [
    {
      "id": "rhythmTemplate1",
      "durations": [0.5, 0.5],
      "templateDuration": 1,  // 1 bar
      "repetition": {
        "startBar": 1,
        "duration": 2  // Repeats every 2 bars
      }
    },
    {
      "id": "rhythmTemplate2",
      "durations": [0.25, 0.25, 0.25, 0.25],
      "templateDuration": 1,  // 1 bar
      "repetition": {
        "startBar": 3,
        "duration": 2  // Repeats every 2 bars
      }
    }
  ],
  "seeds": {
    "noteSeed": 123456,
    "rhythmSeed": 654321
  }
}

Risks and Mitigations

	•	Risk: Potential conflicts with existing functionalities.
	•	Mitigation: Thorough testing and code reviews to ensure compatibility.
	•	Risk: User confusion due to changes.
	•	Mitigation: Provide clear documentation and in-app guidance.

Future Considerations

	•	Reintroduce Tempo and Swing:
	•	Plan to re-enable these features in future updates with enhanced functionality.
	•	Advanced Features:
	•	Consider adding layered templates or conditional logic.
	•	User Feedback Integration:
	•	Collect user feedback post-update to inform future enhancements.

Conclusion

This update enhances the existing application by introducing bar-based note sequences and flexible templating while maintaining compatibility with current features. By focusing on seamless integration and user experience, we aim to provide valuable new functionalities without disrupting existing workflows.