// Interactive Visual State Walkthrough Data for DSA Problems & Patterns
// Powers the step-by-step Visual Solver in IntuitionTab

export const problemVisualizers = {
  "two-sum": {
    patternType: "hashmap",
    title: "HashMap Single-Pass Complement Lookup",
    inputData: [2, 7, 11, 15],
    target: 9,
    steps: [
      {
        step: 1,
        title: "Initialize Seen HashMap",
        description: "We prepare an empty dictionary 'seen = {}' to store value → index mappings as we inspect elements.",
        pointerIndex: -1,
        highlightIndices: [],
        hashMap: {},
        currentVal: null,
        complement: null,
        matched: false,
        codeSnippet: "seen = {}"
      },
      {
        step: 2,
        title: "Check Index 0 (num = 2)",
        description: "Target is 9. We need complement (9 - 2 = 7). Is 7 in seen? No. Store seen[2] = 0.",
        pointerIndex: 0,
        highlightIndices: [0],
        hashMap: { "2": 0 },
        currentVal: 2,
        complement: 7,
        matched: false,
        codeSnippet: "complement = 9 - 2 # 7\nseen[2] = 0"
      },
      {
        step: 3,
        title: "Check Index 1 (num = 7) — Match Found!",
        description: "Target is 9. We need complement (9 - 7 = 2). Is 2 in seen? YES! Found at index 0. We immediately return [seen[2], 1] = [0, 1].",
        pointerIndex: 1,
        highlightIndices: [0, 1],
        hashMap: { "2": 0 },
        currentVal: 7,
        complement: 2,
        matched: true,
        codeSnippet: "if complement in seen:\n    return [seen[2], 1] # [0, 1]"
      }
    ]
  },
  "max-average-subarray-i": {
    patternType: "sliding-window",
    title: "Fixed-Size Sliding Window (k = 4)",
    inputData: [1, 12, -5, -6, 50, 3],
    k: 4,
    steps: [
      {
        step: 1,
        title: "Build First Window of Size k = 4",
        description: "Sum up the first 4 elements: 1 + 12 + (-5) + (-6) = 2. Maximum sum so far = 2.",
        windowStart: 0,
        windowEnd: 3,
        highlightIndices: [0, 1, 2, 3],
        windowSum: 2,
        maxSum: 2,
        maxAvg: 0.5,
        codeSnippet: "window_sum = sum(nums[:4]) # 2\nmax_sum = 2"
      },
      {
        step: 2,
        title: "Slide Window: Drop nums[0] (1), Add nums[4] (50)",
        description: "Subtract outgoing element 1 and add incoming element 50. New sum = 2 - 1 + 50 = 51. Since 51 > 2, max_sum updates to 51!",
        windowStart: 1,
        windowEnd: 4,
        highlightIndices: [1, 2, 3, 4],
        outgoingIdx: 0,
        incomingIdx: 4,
        windowSum: 51,
        maxSum: 51,
        maxAvg: 12.75,
        codeSnippet: "window_sum += nums[4] - nums[0] # 51\nmax_sum = max(2, 51) # 51"
      },
      {
        step: 3,
        title: "Slide Window: Drop nums[1] (12), Add nums[5] (3)",
        description: "Subtract 12 and add 3. New sum = 51 - 12 + 3 = 42. Since 42 < 51, max_sum remains 51.",
        windowStart: 2,
        windowEnd: 5,
        highlightIndices: [2, 3, 4, 5],
        outgoingIdx: 1,
        incomingIdx: 5,
        windowSum: 42,
        maxSum: 51,
        maxAvg: 12.75,
        codeSnippet: "window_sum += nums[5] - nums[1] # 42\nmax_sum = max(51, 42) # 51"
      },
      {
        step: 4,
        title: "Final Result Computed",
        description: "The end of the array is reached. Return max_sum / k = 51 / 4 = 12.75.",
        windowStart: 1,
        windowEnd: 4,
        highlightIndices: [1, 2, 3, 4],
        windowSum: 51,
        maxSum: 51,
        maxAvg: 12.75,
        codeSnippet: "return max_sum / 4 # 12.75"
      }
    ]
  },
  "longest-substring-no-repeat": {
    patternType: "variable-window",
    title: "Variable Sliding Window with Hash Set",
    inputData: ["a", "b", "c", "a", "b", "c", "b", "b"],
    steps: [
      {
        step: 1,
        title: "Expand Right: Window ['a']",
        description: "Right pointer at index 0 ('a'). 'a' is not in set. Add to set. Window length = 1.",
        windowStart: 0,
        windowEnd: 0,
        highlightIndices: [0],
        charSet: ["a"],
        maxLen: 1,
        codeSnippet: "seen.add('a')\nmax_len = max(0, 0 - 0 + 1) # 1"
      },
      {
        step: 2,
        title: "Expand Right: Window ['a', 'b', 'c']",
        description: "Right pointer advances to 'b' and 'c'. Neither are duplicates. Window expands to length 3.",
        windowStart: 0,
        windowEnd: 2,
        highlightIndices: [0, 1, 2],
        charSet: ["a", "b", "c"],
        maxLen: 3,
        codeSnippet: "seen.add('b'); seen.add('c')\nmax_len = 3"
      },
      {
        step: 3,
        title: "Duplicate Encountered: 'a' at Index 3",
        description: "'a' is already in set! Shrink left pointer until duplicate is removed. Remove s[0] ('a'), left moves to 1. Add incoming 'a'. Window is now ['b', 'c', 'a'] (len 3).",
        windowStart: 1,
        windowEnd: 3,
        highlightIndices: [1, 2, 3],
        charSet: ["b", "c", "a"],
        maxLen: 3,
        codeSnippet: "while s[right] in seen:\n    seen.remove(s[left])\n    left += 1"
      },
      {
        step: 4,
        title: "Optimal Window Identified",
        description: "Substrings continue expanding/shrinking. The maximum unique length seen throughout the entire traversal is 3 ('abc').",
        windowStart: 0,
        windowEnd: 2,
        highlightIndices: [0, 1, 2],
        charSet: ["a", "b", "c"],
        maxLen: 3,
        codeSnippet: "return max_len # 3"
      }
    ]
  },
  "two-sum-ii": {
    patternType: "two-pointers",
    title: "Two Pointers Converging on Sorted Array",
    inputData: [2, 7, 11, 15],
    target: 9,
    steps: [
      {
        step: 1,
        title: "Initialize Left at 0 and Right at End",
        description: "Left = 0 (val = 2), Right = 3 (val = 15). Sum = 2 + 15 = 17.",
        left: 0,
        right: 3,
        highlightIndices: [0, 3],
        currentSum: 17,
        codeSnippet: "left, right = 0, len(nums) - 1\ntotal = 2 + 15 # 17"
      },
      {
        step: 2,
        title: "Sum (17) > Target (9) → Decrement Right",
        description: "Because the array is sorted, 17 is too large. We must decrease the sum by moving Right from index 3 to 2.",
        left: 0,
        right: 2,
        highlightIndices: [0, 2],
        currentSum: 13,
        codeSnippet: "if total > target:\n    right -= 1 # right = 2\ntotal = 2 + 11 # 13"
      },
      {
        step: 3,
        title: "Sum (13) > Target (9) → Decrement Right",
        description: "13 is still too large. Decrement Right to index 1.",
        left: 0,
        right: 1,
        highlightIndices: [0, 1],
        currentSum: 9,
        codeSnippet: "right -= 1 # right = 1\ntotal = 2 + 7 # 9"
      },
      {
        step: 4,
        title: "Sum (9) == Target (9) → Match Found!",
        description: "2 + 7 exactly equals 9! Return 1-based indices [left + 1, right + 1] = [1, 2].",
        left: 0,
        right: 1,
        highlightIndices: [0, 1],
        currentSum: 9,
        matched: true,
        codeSnippet: "return [left + 1, right + 1] # [1, 2]"
      }
    ]
  },
  "binary-search": {
    patternType: "binary-search",
    title: "Binary Search Halving Search Space",
    inputData: [-1, 0, 3, 5, 9, 12],
    target: 9,
    steps: [
      {
        step: 1,
        title: "Initial Bounds: L = 0, R = 5",
        description: "Middle index = (0 + 5) // 2 = 2. nums[2] is 3. Target is 9.",
        left: 0,
        right: 5,
        mid: 2,
        highlightIndices: [0, 2, 5],
        codeSnippet: "left, right = 0, 5\nmid = 2\nnums[2] == 3 < 9"
      },
      {
        step: 2,
        title: "nums[mid] (3) < Target (9) → Discard Left Half",
        description: "Since array is sorted, 9 cannot be in indices 0..2. Move L to mid + 1 = 3.",
        left: 3,
        right: 5,
        mid: 4,
        highlightIndices: [3, 4, 5],
        codeSnippet: "left = mid + 1 # 3\nmid = (3 + 5) // 2 # 4"
      },
      {
        step: 3,
        title: "Check New Mid (Index 4) → Found Target 9!",
        description: "nums[4] is 9, which matches target 9! Return index 4 in O(log N) time.",
        left: 3,
        right: 5,
        mid: 4,
        highlightIndices: [4],
        matched: true,
        codeSnippet: "if nums[mid] == target:\n    return 4"
      }
    ]
  },
  "reverse-linked-list": {
    patternType: "linked-list",
    title: "In-Place Pointer Inversion",
    inputData: [1, 2, 3, 4, 5],
    steps: [
      {
        step: 1,
        title: "Initialize prev = None, curr = 1",
        description: "We prepare prev pointer pointing to None, and curr starting at head node 1.",
        prevVal: "None",
        currVal: 1,
        nextVal: 2,
        nodes: [1, 2, 3, 4, 5],
        codeSnippet: "prev = None\ncurr = head # Node(1)"
      },
      {
        step: 2,
        title: "Reverse First Node: 1 -> None",
        description: "Save next_temp = 2. Point 1.next to prev (None). Advance prev to 1, curr to 2.",
        prevVal: 1,
        currVal: 2,
        nextVal: 3,
        nodes: ["1 ➔ None", "2 ➔ 3 ➔ ..."],
        codeSnippet: "next_temp = curr.next\ncurr.next = prev\nprev = curr\ncurr = next_temp"
      },
      {
        step: 3,
        title: "Reverse Second Node: 2 -> 1 -> None",
        description: "Point 2.next to 1. Advance prev to 2, curr to 3.",
        prevVal: 2,
        currVal: 3,
        nextVal: 4,
        nodes: ["2 ➔ 1 ➔ None", "3 ➔ 4 ➔ ..."],
        codeSnippet: "curr.next = prev\nprev = 2; curr = 3"
      },
      {
        step: 4,
        title: "List Fully Inverted: 5 -> 4 -> 3 -> 2 -> 1 -> None",
        description: "Loop completes when curr becomes None. Return prev (Node 5) as the new head.",
        prevVal: 5,
        currVal: "None",
        nextVal: "None",
        nodes: ["5 ➔ 4 ➔ 3 ➔ 2 ➔ 1 ➔ None"],
        codeSnippet: "return prev # Node(5)"
      }
    ]
  },
  "valid-parentheses": {
    patternType: "stack",
    title: "LIFO Stack Matching",
    inputData: ["(", "{", "}", ")"],
    steps: [
      {
        step: 1,
        title: "Push '(' onto Stack",
        description: "Encounter opening bracket '('. Push to stack. Stack: ['('].",
        stack: ["("],
        char: "(",
        codeSnippet: "stack.append('(')"
      },
      {
        step: 2,
        title: "Push '{' onto Stack",
        description: "Encounter opening bracket '{'. Push to stack. Stack: ['(', '{'].",
        stack: ["(", "{"],
        char: "{",
        codeSnippet: "stack.append('{')"
      },
      {
        step: 3,
        title: "Match '}' with Top '{' — Pop!",
        description: "Closing '}' matches top of stack '{'. Pop '{' from stack. Stack: ['('].",
        stack: ["("],
        char: "}",
        codeSnippet: "if stack[-1] == pair['}']:\n    stack.pop()"
      },
      {
        step: 4,
        title: "Match ')' with Top '(' — Valid!",
        description: "Closing ')' matches top of stack '('. Pop '('. Stack is now empty! String is valid.",
        stack: [],
        char: ")",
        matched: true,
        codeSnippet: "return len(stack) == 0 # True"
      }
    ]
  }
};

/**
 * Generates an intuitive visual simulation walkthrough for any problem.
 * If specific handcrafted step data exists, it returns it;
 * otherwise it synthesizes a step-by-step visual sequence based on the pattern and example.
 */
export function getProblemVisualizer(problem) {
  if (!problem) return null;

  // 1. Direct predefined walkthrough
  if (problemVisualizers[problem.id]) {
    return problemVisualizers[problem.id];
  }

  const pLower = (problem.pattern || "").toLowerCase();
  const nameLower = (problem.name || "").toLowerCase();

  // 2. Sliding Window Pattern Generator
  if (pLower.includes("sliding window") || pLower.includes("window")) {
    return {
      patternType: "sliding-window",
      title: `${problem.pattern} Visual Walkthrough`,
      inputData: [2, 1, 5, 2, 3, 2],
      steps: [
        {
          step: 1,
          title: "Initialize Window (left = 0, right = 0)",
          description: "Both window boundaries start at index 0. We inspect elements by expanding right.",
          windowStart: 0,
          windowEnd: 0,
          highlightIndices: [0],
          codeSnippet: "left = 0\nfor right in range(len(nums)):"
        },
        {
          step: 2,
          title: "Expand Right to Expand Window",
          description: "Advance right pointer to incorporate incoming element into current state.",
          windowStart: 0,
          windowEnd: 2,
          highlightIndices: [0, 1, 2],
          codeSnippet: "update_state(nums[right])"
        },
        {
          step: 3,
          title: "Check Window Invariant Condition",
          description: "When the window condition is met or violated, shrink from left pointer or record the optimal result.",
          windowStart: 1,
          windowEnd: 2,
          highlightIndices: [1, 2],
          codeSnippet: "while window_invalid:\n    left += 1"
        },
        {
          step: 4,
          title: "Optimal Subarray / Window Stored",
          description: "Track the best window size or value found across the traversal and return.",
          windowStart: 1,
          windowEnd: 3,
          highlightIndices: [1, 2, 3],
          codeSnippet: "max_result = max(max_result, current_window)"
        }
      ]
    };
  }

  // 3. Two Pointers Pattern Generator
  if (pLower.includes("two pointer") || pLower.includes("pointer")) {
    return {
      patternType: "two-pointers",
      title: `${problem.pattern} Visual Walkthrough`,
      inputData: [1, 3, 4, 7, 10],
      steps: [
        {
          step: 1,
          title: "Initialize Left (0) and Right (End)",
          description: "Pointers start at opposite ends of the sorted sequence.",
          left: 0,
          right: 4,
          highlightIndices: [0, 4],
          codeSnippet: "left, right = 0, len(nums) - 1"
        },
        {
          step: 2,
          title: "Evaluate Condition at Left & Right",
          description: "Compare values or sum at indices left and right against target condition.",
          left: 0,
          right: 3,
          highlightIndices: [0, 3],
          codeSnippet: "if condition_too_large:\n    right -= 1"
        },
        {
          step: 3,
          title: "Converge Pointers Inward",
          description: "Advance left pointer or decrement right pointer to eliminate sub-optimal pairs in O(N).",
          left: 1,
          right: 3,
          highlightIndices: [1, 3],
          codeSnippet: "elif condition_too_small:\n    left += 1"
        },
        {
          step: 4,
          title: "Target Found or Pointers Meet",
          description: "Algorithm terminates when pointers cross or target pair is found.",
          left: 1,
          right: 2,
          highlightIndices: [1, 2],
          matched: true,
          codeSnippet: "return [left, right]"
        }
      ]
    };
  }

  // 4. Binary Search Pattern Generator
  if (pLower.includes("binary search") || nameLower.includes("binary search")) {
    return {
      patternType: "binary-search",
      title: `${problem.pattern} Visual Walkthrough`,
      inputData: [1, 3, 7, 12, 18, 25],
      steps: [
        {
          step: 1,
          title: "Establish Bounds: L = 0, R = End",
          description: "Calculate midpoint mid = (L + R) // 2 to inspect center element.",
          left: 0,
          right: 5,
          mid: 2,
          highlightIndices: [0, 2, 5],
          codeSnippet: "mid = (left + right) // 2"
        },
        {
          step: 2,
          title: "Halve Search Space by Half",
          description: "Determine whether target lies in left half or right half and discard 50% of elements.",
          left: 3,
          right: 5,
          mid: 4,
          highlightIndices: [3, 4, 5],
          codeSnippet: "if target > nums[mid]:\n    left = mid + 1"
        },
        {
          step: 3,
          title: "Target Located in O(log N)",
          description: "Candidate index narrowed down and verified.",
          left: 3,
          right: 4,
          mid: 3,
          highlightIndices: [3],
          matched: true,
          codeSnippet: "return mid"
        }
      ]
    };
  }

  // 5. Default General Pattern Generator (Hash Table / DP / Traversal)
  return {
    patternType: "general",
    title: `${problem.pattern || "Algorithmic Pattern"} Visual Walkthrough`,
    inputData: [1, 2, 3, 4],
    steps: [
      {
        step: 1,
        title: "1. State & Data Structure Initialization",
        description: "Set up auxiliary state tracking (HashMap, Set, Queue, or DP memo array) to achieve linear O(N) efficiency.",
        highlightIndices: [0],
        codeSnippet: "state = initialize_tracker()"
      },
      {
        step: 2,
        title: "2. Process Element Sequentially",
        description: "Iterate through input elements and check for existing recorded pattern signatures.",
        highlightIndices: [0, 1],
        codeSnippet: "for item in collection:\n    if item in state: update()"
      },
      {
        step: 3,
        title: "3. Update State Invariant",
        description: "Record current element or branch condition into memory structure.",
        highlightIndices: [1, 2],
        codeSnippet: "state[item] = current_value"
      },
      {
        step: 4,
        title: "4. Return Optimal Solution",
        description: "Algorithm concludes with optimal result without redundant nested loops.",
        highlightIndices: [2, 3],
        matched: true,
        codeSnippet: "return result"
      }
    ]
  };
}
