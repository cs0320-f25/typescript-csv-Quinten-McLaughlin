# Sprint 1: TypeScript CSV

### Task C: Proposing Enhancement

- #### Step 1: Brainstorm on your own.
These 4 are taken from which tests fail in basoc-parser.test.ts
    1

- #### Step 2: Use an LLM to help expand your perspective.
It gave some recommendations but most were explained using too technical of language. However, there is some overlap with it mentioning handling header rows and double quotes. It did not mention handling commas but did talk about "dialect options" so it might be apart of that. It doesn't seem to know how much knowledge I have and said things like "strip UTF-8 BOM" which I don't understand, and it assumed I know what that does. It also gave some recommendations related to my other tests like handling empty fields and whitespace. Also worth mentioning there were pages of other recommendations also given, like backpressure and chunking, I'm not sure what those are either.

When I tried with 2 other prompts. One said I have limited knowledge of how parsers work and am a sophomore CS student, and it outputted much more paragraph-based recommendations, which wasn't what I wanted. The other said imagine it from the perspective of someone writing a testing file for it, and break down each recommendation by its corresponding test, which was very helpful.

- #### Step 3: use an LLM to help expand your perspective.

    Include a list of the top 4 enhancements or edge cases you think are most valuable to explore in the next week’s sprint. Label them clearly by category (extensibility vs. functionality), and include whether they came from you, the LLM, or both. Describe these using the User Story format—see below for a definition. 

Extensibility:
    1. "As a develoepr using the CSV application, I can specify whether the first row of the CSV file is a header row so that the output result includes only the data"
        Acceptance Criteria:
        - The parser accepts a boolean to indicate if there is a header row or not
        - If there is a header, the first row is excluded from the output array

    2. "As a developer using the CSV application, I can get accurate error information when the data is malformed: inconsistent columns, unfinished quotes, NaNs, etc."
        Acceptance Criteria: 
        - The parser gives a specific exception or error object (probably more flexible?) that includes an error message, type of malformation, and row number it occurred.
        - The parser should never skip or misinterpret malformed data without throwing an error

Functionality:
    3. "As a developer using the CSV application, I can correctly parse fields that have double/duplicate quotes."
        Acceptance Criteria:
        - The parser should identify when a field is already enclosed in double quotes
        - The enclosing double quotes should be removed from the final output field
        - Double quotes like "" should be interpreted as a single double quote "

    4. "As a developer using the CSV application, I can correctly parse fields that contain commas within it, so that they are not unintentionally divided into multiple columns."
        Acceptance Criteria:
        - Again detects when a field already has double quotes and removes them upon parsing
        - The parser should treat commas within a quoted field as apart of the same field

    Include your notes from above: what were your initial ideas, what did the LLM suggest, and how did the results differ by prompt? What resonated with you, and what didn’t? (3-5 sentences.) 

Initial ideas:
    It should be able to detect or throw an error when something that should be a number can't be converted to one (like "thirty"), handle double quotes and remove duplicates like ""30""", handle commas by detecting when it should be apart of one field, handle header rows by not including it in the results.

The LLM gave some recommendations but most were explained using too technical of language. However, there is some overlap with it mentioning handling header rows and double quotes. It doesn't seem to know how much knowledge I have and said things like "strip UTF-8 BOM" or "backpressure" which I don't understand, and it assumed I know what that does. My second prompt added that I have limited knowledge of how parsers work and am a sophomore CS student, and it outputted much more paragraph-based recommendations, which wasn't what I wanted. The other said imagine it from the perspective of someone writing a testing file for it, and break down each recommendation by its corresponding test, which was very helpful but usually too complex.



### Design Choices

### 1340 Supplement

- #### 1. Correctness

- #### 2. Random, On-Demand Generation

- #### 3. Overall experience, Bugs encountered and resolved
#### Errors/Bugs:
#### Tests:
#### How To…

#### Team members and contributions (include cs logins):

#### Collaborators (cslogins of anyone you worked with on this project and/or generative AI):
#### Total estimated time it took to complete project:
#### Link to GitHub Repo:  
