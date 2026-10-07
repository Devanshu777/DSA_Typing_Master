// Concrete Visual State Walkthroughs & Problem Solvers
// Grounded in each problem's actual Example (input, output, explanation) from problemDescriptions.
import { problemDescriptions } from "@/data/problemDescriptions";

export const problemVisualizers = {
  // ─── DAY 1: ARRAYS + HASHING ──────────────────────────────────────────────
  "two-sum": {
    patternType: "hashmap",
    title: "HashMap Single-Pass Complement Lookup",
    inputData: [2, 7, 11, 15],
    target: 9,
    steps: [
      {
        step: 1,
        title: "Step 1: Initialize HashMap `seen = {}`",
        description: "Given nums = [2, 7, 11, 15] and target = 9. We initialize an empty hash map `seen` to store value → index mappings as we scan through the array.",
        highlightIndices: [],
        hashMap: {},
        codeSnippet: "seen = {}"
      },
      {
        step: 2,
        title: "Step 2: Inspect index 0 (nums[0] = 2)",
        description: "Calculate complement = target - nums[0] = 9 - 2 = 7. We check if 7 is in seen. It's not! So we record seen[2] = 0.",
        highlightIndices: [0],
        pointers: { i: 0 },
        hashMap: { "2": 0 },
        codeSnippet: "complement = target - n # 9 - 2 = 7\nif complement in seen: ... # False\nseen[2] = 0"
      },
      {
        step: 3,
        title: "Step 3: Inspect index 1 (nums[1] = 7) — Match Found!",
        description: "Calculate complement = target - nums[1] = 9 - 7 = 2. We check seen: 2 IS in seen at index 0! We immediately return [seen[2], 1] = [0, 1].",
        highlightIndices: [0, 1],
        pointers: { i: 1 },
        hashMap: { "2": 0 },
        matched: true,
        codeSnippet: "complement = 9 - 7 # 2\nif complement in seen:\n    return [seen[2], 1] # [0, 1]"
      }
    ]
  },

  "contains-duplicate": {
    patternType: "hashset",
    title: "HashSet O(1) Duplicate Detection",
    inputData: [1, 2, 3, 1],
    steps: [
      {
        step: 1,
        title: "Step 1: Initialize Empty Set `seen = set()`",
        description: "Given nums = [1, 2, 3, 1]. A hash set provides O(1) lookup. If any number is already present in `seen`, a duplicate is found.",
        highlightIndices: [],
        hashSet: [],
        codeSnippet: "seen = set()"
      },
      {
        step: 2,
        title: "Step 2: Inspect index 0 (num = 1)",
        description: "1 is not in seen. Add 1 to seen → {1}.",
        highlightIndices: [0],
        pointers: { i: 0 },
        hashSet: [1],
        codeSnippet: "if n in seen: ... # False\nseen.add(1)"
      },
      {
        step: 3,
        title: "Step 3: Inspect index 1 (num = 2)",
        description: "2 is not in seen. Add 2 to seen → {1, 2}.",
        highlightIndices: [1],
        pointers: { i: 1 },
        hashSet: [1, 2],
        codeSnippet: "seen.add(2)"
      },
      {
        step: 4,
        title: "Step 4: Inspect index 2 (num = 3)",
        description: "3 is not in seen. Add 3 to seen → {1, 2, 3}.",
        highlightIndices: [2],
        pointers: { i: 2 },
        hashSet: [1, 2, 3],
        codeSnippet: "seen.add(3)"
      },
      {
        step: 5,
        title: "Step 5: Inspect index 3 (num = 1) — Duplicate Found!",
        description: "1 is ALREADY in seen! We found a duplicate element. Return True immediately without checking further.",
        highlightIndices: [0, 3],
        pointers: { i: 3 },
        hashSet: [1, 2, 3],
        matched: true,
        codeSnippet: "if 1 in seen: # True!\n    return True"
      }
    ]
  },

  "group-anagrams": {
    patternType: "grouping",
    title: "Canonical Sorted Tuple Key Grouping",
    inputData: ["eat", "tea", "tan", "ate", "nat", "bat"],
    steps: [
      {
        step: 1,
        title: "Step 1: Canonical Signature Concept",
        description: "Anagrams contain the exact same characters with the same frequency. Sorting any anagram produces the identical tuple key, e.g. sorted('eat') == ('a','e','t').",
        highlightIndices: [],
        hashMap: {},
        codeSnippet: "groups = defaultdict(list)"
      },
      {
        step: 2,
        title: "Step 2: Process 'eat' and 'tea'",
        description: "'eat' → key ('a','e','t') → [eat]. 'tea' → key ('a','e','t') → [eat, tea]. Both share the exact same bucket.",
        highlightIndices: [0, 1],
        hashMap: {
          "('a','e','t')": ["eat", "tea"]
        },
        codeSnippet: "key = tuple(sorted(word))\ngroups[key].append(word)"
      },
      {
        step: 3,
        title: "Step 3: Process 'tan' and 'ate'",
        description: "'tan' → key ('a','n','t') → new bucket [tan]. 'ate' → key ('a','e','t') → joins first bucket [eat, tea, ate].",
        highlightIndices: [2, 3],
        hashMap: {
          "('a','e','t')": ["eat", "tea", "ate"],
          "('a','n','t')": ["tan"]
        },
        codeSnippet: "groups[tuple(sorted('ate'))].append('ate')"
      },
      {
        step: 4,
        title: "Step 4: Process 'nat' and 'bat'",
        description: "'nat' → joins ('a','n','t') → [tan, nat]. 'bat' → key ('a','b','t') → [bat]. All 6 words are now partitioned into 3 anagram groups.",
        highlightIndices: [4, 5],
        hashMap: {
          "('a','e','t')": ["eat", "tea", "ate"],
          "('a','n','t')": ["tan", "nat"],
          "('a','b','t')": ["bat"]
        },
        codeSnippet: "groups[tuple(sorted('bat'))].append('bat')"
      },
      {
        step: 5,
        title: "Step 5: Return Grouped Lists",
        description: "Convert defaultdict values to list: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]. Done in O(N · K log K) time.",
        highlightIndices: [0, 1, 2, 3, 4, 5],
        matched: true,
        codeSnippet: "return list(groups.values())"
      }
    ]
  },

  "top-k-frequent": {
    patternType: "bucket-sort",
    title: "Frequency Map + Bucket Sort O(N)",
    inputData: [1, 1, 1, 2, 2, 3],
    k: 2,
    steps: [
      {
        step: 1,
        title: "Step 1: Input Setup & Problem Goal",
        description: "Given nums = [1, 1, 1, 2, 2, 3] and k = 2. We must return the 2 most frequent numbers in O(N) time without sorting the whole array.",
        highlightIndices: [0, 1, 2, 3, 4, 5],
        memoryState: { label: "Target", data: "Find top k = 2 elements" },
        codeSnippet: "count = Counter(nums)"
      },
      {
        step: 2,
        title: "Step 2: Count Frequencies with Counter",
        description: "Count each number's occurrences: 1 appears 3 times, 2 appears 2 times, 3 appears 1 time.",
        highlightIndices: [0, 1, 2, 3, 4, 5],
        hashMap: { "1": "3 times", "2": "2 times", "3": "1 time" },
        codeSnippet: "count = Counter(nums)\n# {1: 3, 2: 2, 3: 1}"
      },
      {
        step: 3,
        title: "Step 3: Create Frequency Buckets (Index = Count)",
        description: "Initialize an array of empty buckets of length len(nums) + 1 = 7. Bucket index represents how many times a number appeared.",
        highlightIndices: [],
        memoryState: { label: "Buckets", data: "bucket = [[] for _ in range(7)]" },
        codeSnippet: "bucket = [[] for _ in range(len(nums) + 1)]"
      },
      {
        step: 4,
        title: "Step 4: Distribute Numbers into Buckets",
        description: "Place numbers into buckets by frequency: 1 into bucket[3], 2 into bucket[2], 3 into bucket[1]. All other buckets remain empty.",
        highlightIndices: [0, 1, 2],
        hashMap: {
          "bucket[3]": [1],
          "bucket[2]": [2],
          "bucket[1]": [3]
        },
        codeSnippet: "for num, freq in count.items():\n    bucket[freq].append(num)"
      },
      {
        step: 5,
        title: "Step 5: Scan Buckets Backwards (Highest Frequency First)",
        description: "Start from highest bucket index (6 down to 1). bucket[6], bucket[5], bucket[4] are empty. At bucket[3], we find [1]! Add 1 to result. result = [1]. Need 1 more element.",
        highlightIndices: [0, 1, 2],
        memoryState: { label: "Result so far", data: "[1] (len = 1 < k)" },
        codeSnippet: "for i in range(len(bucket) - 1, 0, -1):\n    for n in bucket[i]:\n        result.append(n) # [1]"
      },
      {
        step: 6,
        title: "Step 6: Next Bucket [2] — Exactly k = 2 Elements Found!",
        description: "Check bucket[2]: contains [2]! Append 2 to result → result = [1, 2]. Now len(result) == k (2)! We can stop immediately and return [1, 2].",
        highlightIndices: [0, 1, 2, 3, 4],
        matched: true,
        memoryState: { label: "Final Result", data: "[1, 2]" },
        codeSnippet: "result.append(2) # [1, 2]\nif len(result) == k:\n    return result # [1, 2]"
      }
    ]
  },

  // ─── DAY 2: TWO POINTERS ──────────────────────────────────────────────────
  "valid-palindrome": {
    patternType: "two-pointers",
    title: "Two Pointers Converging Inward",
    inputData: ["a", "m", "a", "n", "a", "p", "l", "a", "n", "a", "c", "a", "n", "a", "l", "p", "a", "n", "a", "m", "a"],
    steps: [
      {
        step: 1,
        title: "Step 1: Clean & Normalize String",
        description: "Raw string: 'A man, a plan, a canal: Panama'. Filter alphanumeric characters and convert to lowercase: 'amanaplanacanalpanama'. Set Left = 0 ('a'), Right = 20 ('a').",
        highlightIndices: [0, 20],
        pointers: { L: 0, R: 20 },
        codeSnippet: "left, right = 0, len(s) - 1"
      },
      {
        step: 2,
        title: "Step 2: Compare Outer Characters (a == a)",
        description: "s[0] ('a') == s[20] ('a') → match! Advance Left to 1 ('m') and Right to 19 ('m').",
        highlightIndices: [1, 19],
        pointers: { L: 1, R: 19 },
        codeSnippet: "if s[left] != s[right]: return False\nleft += 1; right -= 1"
      },
      {
        step: 3,
        title: "Step 3: Compare Next Characters (m == m, a == a)",
        description: "s[1] ('m') == s[19] ('m') → match! s[2] ('a') == s[18] ('a') → match! Pointers continue advancing toward center.",
        highlightIndices: [2, 18],
        pointers: { L: 2, R: 18 },
        codeSnippet: "left += 1; right -= 1"
      },
      {
        step: 4,
        title: "Step 4: Continue Inward Comparison",
        description: "All symmetric character pairs ('n'=='n', 'a'=='a', 'p'=='p', 'l'=='l', 'a'=='a', 'n'=='n', 'a'=='a') match perfectly.",
        highlightIndices: [5, 15],
        pointers: { L: 5, R: 15 },
        codeSnippet: "while left < right: ..."
      },
      {
        step: 5,
        title: "Step 5: Pointers Meet at Center ('c') → Palindrome Validated!",
        description: "Left and Right cross at index 10 ('c'). Every character matched symmetrically. Return True in O(N) time with O(1) extra space.",
        highlightIndices: [10],
        pointers: { L: 10, R: 10 },
        matched: true,
        codeSnippet: "return True"
      }
    ]
  },

  "two-sum-ii": {
    patternType: "two-pointers",
    title: "Sorted Array Two Pointers Inward Convergence",
    inputData: [2, 7, 11, 15],
    target: 9,
    steps: [
      {
        step: 1,
        title: "Step 1: Left at 0 (2), Right at 3 (15)",
        description: "Numbers are sorted in ascending order. Current sum = nums[0] + nums[3] = 2 + 15 = 17. Target is 9.",
        highlightIndices: [0, 3],
        pointers: { L: 0, R: 3 },
        memoryState: { label: "Current Sum", data: "2 + 15 = 17" },
        codeSnippet: "left, right = 0, len(numbers) - 1\ncur = 2 + 15 # 17"
      },
      {
        step: 2,
        title: "Step 2: Sum (17) > Target (9) → Decrement Right",
        description: "Because the array is sorted, 17 is too large. Decreasing Left would only increase or keep it large, so we MUST decrease Right to index 2 (11). New sum = 2 + 11 = 13.",
        highlightIndices: [0, 2],
        pointers: { L: 0, R: 2 },
        memoryState: { label: "Current Sum", data: "2 + 11 = 13 (Still > 9)" },
        codeSnippet: "if cur > target:\n    right -= 1 # right = 2"
      },
      {
        step: 3,
        title: "Step 3: Sum (13) > Target (9) → Decrement Right Again",
        description: "13 is still greater than 9. Decrement Right to index 1 (7). New sum = 2 + 7 = 9.",
        highlightIndices: [0, 1],
        pointers: { L: 0, R: 1 },
        memoryState: { label: "Current Sum", data: "2 + 7 = 9 (Match!)" },
        codeSnippet: "right -= 1 # right = 1\ncur = 2 + 7 # 9"
      },
      {
        step: 4,
        title: "Step 4: Sum equals Target → Return 1-Based Indices [1, 2]",
        description: "Found target 9! Problem requires 1-indexed results: [left + 1, right + 1] = [1, 2].",
        highlightIndices: [0, 1],
        pointers: { L: 0, R: 1 },
        matched: true,
        codeSnippet: "elif cur == target:\n    return [left + 1, right + 1] # [1, 2]"
      }
    ]
  },

  "3sum": {
    patternType: "two-pointers",
    title: "Sort Array + Fix One Element + Two Pointers",
    inputData: [-4, -1, -1, 0, 1, 2],
    steps: [
      {
        step: 1,
        title: "Step 1: Sort the Array",
        description: "Input nums = [-1, 0, 1, 2, -1, -4]. After sorting: [-4, -1, -1, 0, 1, 2]. Sorting enables O(N) two pointers and effortless duplicate skipping.",
        highlightIndices: [0, 1, 2, 3, 4, 5],
        codeSnippet: "nums.sort() # [-4, -1, -1, 0, 1, 2]"
      },
      {
        step: 2,
        title: "Step 2: Inspect i = 0 (nums[0] = -4)",
        description: "Fix -4. Two pointers L = 1 (-1), R = 5 (2). Sum = -4 + (-1) + 2 = -3 < 0. Advance L. No triplet sums to 0 with -4.",
        highlightIndices: [0, 1, 5],
        pointers: { i: 0, L: 1, R: 5 },
        codeSnippet: "for i, a in enumerate(nums):\n    if a > 0: break"
      },
      {
        step: 3,
        title: "Step 3: Fix i = 1 (nums[1] = -1) → Triplet 1 Found!",
        description: "Set Left = 2 (-1), Right = 5 (2). Sum = -1 + (-1) + 2 = 0! Triplet [-1, -1, 2] found and recorded.",
        highlightIndices: [1, 2, 5],
        pointers: { i: 1, L: 2, R: 5 },
        matched: true,
        codeSnippet: "total = nums[i] + nums[l] + nums[r]\nif total == 0:\n    res.append([-1, -1, 2])"
      },
      {
        step: 4,
        title: "Step 4: Shift Pointers → Triplet 2 Found!",
        description: "Advance Left to 3 (0), Decrement Right to 4 (1). Sum = -1 + 0 + 1 = 0! Second triplet [-1, 0, 1] found.",
        highlightIndices: [1, 3, 4],
        pointers: { i: 1, L: 3, R: 4 },
        matched: true,
        codeSnippet: "res.append([-1, 0, 1])"
      },
      {
        step: 5,
        title: "Step 5: Return Unique Triplets",
        description: "Skip duplicate elements to avoid repeating triplets. Return [[-1, -1, 2], [-1, 0, 1]].",
        highlightIndices: [1, 2, 3, 4, 5],
        matched: true,
        codeSnippet: "return res"
      }
    ]
  },

  // ─── DAY 3: SLIDING WINDOW ────────────────────────────────────────────────
  "max-average-subarray-i": {
    patternType: "sliding-window",
    title: "Fixed-Size Sliding Window (k = 4)",
    inputData: [1, 12, -5, -6, 50, 3],
    k: 4,
    steps: [
      {
        step: 1,
        title: "Step 1: Initialize First Window of Size k = 4",
        description: "Sum the first 4 elements: nums[0..3] = 1 + 12 + (-5) + (-6) = 2. Max sum so far = 2.",
        window: { start: 0, end: 3 },
        highlightIndices: [0, 1, 2, 3],
        pointers: { START: 0, END: 3 },
        memoryState: { label: "Window Sum", data: "2 (Avg = 0.5)" },
        codeSnippet: "window_sum = sum(nums[:4]) # 2\nmax_sum = 2"
      },
      {
        step: 2,
        title: "Step 2: Slide Window Right: Drop nums[0] (1), Add nums[4] (50)",
        description: "Slide right: subtract outgoing element 1 and add incoming element 50. New window sum = 2 - 1 + 50 = 51. Since 51 > 2, max_sum updates to 51!",
        window: { start: 1, end: 4 },
        highlightIndices: [1, 2, 3, 4],
        pointers: { START: 1, END: 4 },
        memoryState: { label: "Window Sum", data: "51 (Avg = 12.75)" },
        codeSnippet: "window_sum += nums[4] - nums[0] # 51\nmax_sum = max(2, 51) # 51"
      },
      {
        step: 3,
        title: "Step 3: Slide Window Right: Drop nums[1] (12), Add nums[5] (3)",
        description: "Subtract outgoing 12 and add incoming 3. New window sum = 51 - 12 + 3 = 42. Since 42 < 51, max_sum remains 51.",
        window: { start: 2, end: 5 },
        highlightIndices: [2, 3, 4, 5],
        pointers: { START: 2, END: 5 },
        memoryState: { label: "Window Sum", data: "42 (Max stays 51)" },
        codeSnippet: "window_sum += nums[5] - nums[1] # 42\nmax_sum = max(51, 42) # 51"
      },
      {
        step: 4,
        title: "Step 4: Return Max Average",
        description: "Array scan complete. Return max_sum / k = 51 / 4 = 12.75.",
        window: { start: 1, end: 4 },
        highlightIndices: [1, 2, 3, 4],
        matched: true,
        codeSnippet: "return max_sum / k # 12.75"
      }
    ]
  },

  "longest-substring-no-repeat": {
    patternType: "sliding-window",
    title: "Variable Sliding Window with Character HashSet",
    inputData: ["a", "b", "c", "a", "b", "c", "b", "b"],
    steps: [
      {
        step: 1,
        title: "Step 1: Expand Window with 'a' and 'b'",
        description: "Right pointer at 0 ('a') and 1 ('b'). Both are unique. Set = {'a', 'b'}. Window length = 2.",
        window: { start: 0, end: 1 },
        highlightIndices: [0, 1],
        pointers: { L: 0, R: 1 },
        hashSet: ["a", "b"],
        codeSnippet: "seen.add(s[r])\nmax_len = 2"
      },
      {
        step: 2,
        title: "Step 2: Expand to 'c' (Window length = 3)",
        description: "'c' is unique. Window is ['a', 'b', 'c'] (indices 0..2). Set = {'a', 'b', 'c'}. max_len = 3.",
        window: { start: 0, end: 2 },
        highlightIndices: [0, 1, 2],
        pointers: { L: 0, R: 2 },
        hashSet: ["a", "b", "c"],
        codeSnippet: "seen.add('c')\nmax_len = max(max_len, 2 - 0 + 1) # 3"
      },
      {
        step: 3,
        title: "Step 3: Duplicate 'a' at Index 3 Encountered",
        description: "Right pointer is at index 3 ('a'). 'a' is already in seen! Shrink window from Left: remove s[0] ('a'), increment Left to 1. Now add incoming 'a'. Window is now ['b', 'c', 'a'] (len 3).",
        window: { start: 1, end: 3 },
        highlightIndices: [1, 2, 3],
        pointers: { L: 1, R: 3 },
        hashSet: ["b", "c", "a"],
        codeSnippet: "while s[r] in seen:\n    seen.remove(s[l])\n    l += 1\nseen.add(s[r])"
      },
      {
        step: 4,
        title: "Step 4: Duplicate 'b' at Index 4 Encountered",
        description: "'b' already in seen. Shrink Left to index 2 ('c'). Window is ['c', 'a', 'b'] (len 3).",
        window: { start: 2, end: 4 },
        highlightIndices: [2, 3, 4],
        pointers: { L: 2, R: 4 },
        hashSet: ["c", "a", "b"],
        codeSnippet: "seen.remove(s[1]) # remove 'b'\nl = 2"
      },
      {
        step: 5,
        title: "Step 5: Traversal Complete — Return Max Length 3",
        description: "Scanning remaining characters ('c', 'b', 'b') yields window lengths ≤ 3. Maximum substring without repeating characters is 3 ('abc').",
        window: { start: 0, end: 2 },
        highlightIndices: [0, 1, 2],
        matched: true,
        codeSnippet: "return max_len # 3"
      }
    ]
  },

  // ─── DAY 4: STACKS ────────────────────────────────────────────────────────
  "valid-parentheses": {
    patternType: "stack",
    title: "Stack LIFO Bracket Matching",
    inputData: ["(", ")", "[", "]", "{", "}"],
    steps: [
      {
        step: 1,
        title: "Step 1: Process '(': Push to Stack",
        description: "Opening bracket '(' encountered. Push to stack. Stack = ['('].",
        highlightIndices: [0],
        pointers: { i: 0 },
        stack: ["("],
        codeSnippet: "stack.append('(')"
      },
      {
        step: 2,
        title: "Step 2: Process ')': Pop and Compare",
        description: "Closing bracket ')' encountered. Pop top of stack: '(' matches ')'. Stack is now empty [].",
        highlightIndices: [1],
        pointers: { i: 1 },
        stack: [],
        codeSnippet: "top = stack.pop() # '('\nif mapping[')'] != top: return False"
      },
      {
        step: 3,
        title: "Step 3: Process '[': Push to Stack",
        description: "Opening bracket '[' encountered. Push to stack. Stack = ['['].",
        highlightIndices: [2],
        pointers: { i: 2 },
        stack: ["["]
      },
      {
        step: 4,
        title: "Step 4: Process ']': Pop and Match",
        description: "Closing bracket ']' encountered. Pop '[' from stack. Bracket pair matches! Stack is empty [].",
        highlightIndices: [3],
        pointers: { i: 3 },
        stack: [],
        codeSnippet: "stack.pop() # '[' matches ']'"
      },
      {
        step: 5,
        title: "Step 5: Process '{' then '}'",
        description: "'{' pushed to stack, then immediately matched and popped by '}'.",
        highlightIndices: [4, 5],
        pointers: { i: 5 },
        stack: [],
        codeSnippet: "stack.append('{')\nstack.pop() # matches"
      },
      {
        step: 6,
        title: "Step 6: Stack Empty → All Brackets Validated!",
        description: "Every opening bracket had its corresponding closing bracket in exact LIFO order. Stack is completely empty. Return True.",
        highlightIndices: [0, 1, 2, 3, 4, 5],
        matched: true,
        codeSnippet: "return len(stack) == 0 # True"
      }
    ]
  },

  // ─── DAY 5: BINARY SEARCH ─────────────────────────────────────────────────
  "binary-search": {
    patternType: "binary-search",
    title: "Binary Search Halving Search Space in O(log N)",
    inputData: [-1, 0, 3, 5, 9, 12],
    target: 9,
    steps: [
      {
        step: 1,
        title: "Step 1: Initial Bounds L = 0 (-1), R = 5 (12)",
        description: "Mid = (0 + 5) // 2 = 2. nums[2] is 3. Compare with target 9: 3 < 9.",
        highlightIndices: [0, 2, 5],
        pointers: { L: 0, MID: 2, R: 5 },
        codeSnippet: "left, right = 0, len(nums) - 1\nmid = (0 + 5) // 2 # 2\nnums[mid] # 3 < 9"
      },
      {
        step: 2,
        title: "Step 2: 3 < 9 → Discard Left Half, Move L to mid + 1 (3)",
        description: "Because nums is sorted, 9 cannot be in indices 0..2. Set left = 2 + 1 = 3. New mid = (3 + 5) // 2 = 4. nums[4] is 9.",
        highlightIndices: [3, 4, 5],
        pointers: { L: 3, MID: 4, R: 5 },
        codeSnippet: "if nums[mid] < target:\n    left = mid + 1 # 3\nmid = (3 + 5) // 2 # 4"
      },
      {
        step: 3,
        title: "Step 3: nums[4] (9) == Target (9) → Target Located!",
        description: "nums[4] exactly equals target 9. Return index 4 in just 2 comparisons!",
        highlightIndices: [4],
        pointers: { MID: 4 },
        matched: true,
        codeSnippet: "if nums[mid] == target:\n    return mid # 4"
      }
    ]
  },

  // ─── DAY 8: LINKED LISTS ──────────────────────────────────────────────────
  "reverse-linked-list": {
    patternType: "linked-list",
    title: "Iterative Pointer Reversal (prev, curr, nxt)",
    inputData: [1, 2, 3, 4, 5],
    steps: [
      {
        step: 1,
        title: "Step 1: Initial State: prev = None, curr = 1",
        description: "Given linked list: 1 → 2 → 3 → 4 → 5 → None. We maintain prev = None and curr pointing to head (1).",
        highlightIndices: [0],
        pointers: { curr: 0 },
        memoryState: { label: "Pointers", data: "prev = None, curr = 1" },
        codeSnippet: "prev, curr = None, head"
      },
      {
        step: 2,
        title: "Step 2: Reverse Node 1",
        description: "Save nxt = 2. Redirect 1.next = None. Advance prev = 1, curr = 2. Now: None ← 1, curr at 2.",
        highlightIndices: [0, 1],
        pointers: { prev: 0, curr: 1 },
        memoryState: { label: "List", data: "None ← 1, curr = 2" },
        codeSnippet: "nxt = curr.next # 2\ncurr.next = prev # None\nprev = curr # 1\ncurr = nxt # 2"
      },
      {
        step: 3,
        title: "Step 3: Reverse Node 2",
        description: "Save nxt = 3. Redirect 2.next = 1. Advance prev = 2, curr = 3. Now: None ← 1 ← 2, curr at 3.",
        highlightIndices: [1, 2],
        pointers: { prev: 1, curr: 2 },
        memoryState: { label: "List", data: "1 ← 2, curr = 3" },
        codeSnippet: "curr.next = prev # 1\nprev, curr = 2, 3"
      },
      {
        step: 4,
        title: "Step 4: Reverse Nodes 3, 4, and 5",
        description: "Nodes continue reversing links sequentially until curr reaches None and prev reaches node 5.",
        highlightIndices: [3, 4],
        pointers: { prev: 4 },
        memoryState: { label: "List", data: "1 ← 2 ← 3 ← 4 ← 5" },
        codeSnippet: "while curr: ..."
      },
      {
        step: 5,
        title: "Step 5: Return New Head (prev = 5)",
        description: "Final reversed list: 5 → 4 → 3 → 2 → 1 → None. Done in O(N) time with O(1) space.",
        highlightIndices: [4],
        pointers: { head: 4 },
        matched: true,
        codeSnippet: "return prev # 5"
      }
    ]
  }
};

// Helper: Smart parser that extracts real example values from problemDescriptions
function parseExampleInput(inputStr) {
  if (!inputStr) return { type: "general", data: ["Step 1", "Step 2", "Step 3", "Result"], raw: "" };

  // 1. Intervals / 2D array
  const matrixMatch = inputStr.match(/\[\s*\[.*?\]\s*\]/);
  if (matrixMatch) {
    try {
      const parsed = JSON.parse(matrixMatch[0]);
      return { type: "matrix", data: parsed.map(p => `[${p.join(",")}]`), raw: inputStr };
    } catch (e) {}
  }

  // 2. String array: strs = ["eat", "tea", ...]
  const strArrayMatch = inputStr.match(/\[\s*\"[^\"]*\"(?:\s*,\s*\"[^\"]*\")*\s*\]/);
  if (strArrayMatch) {
    try {
      const parsed = JSON.parse(strArrayMatch[0]);
      return { type: "string-array", data: parsed, raw: inputStr };
    } catch (e) {}
  }

  // 3. Tree array with nulls: root = [3, 9, 20, null, null, 15, 7]
  if (inputStr.includes("root =") || inputStr.includes("root=")) {
    const treeArrMatch = inputStr.match(/\[\s*([^\]]+)\s*\]/);
    if (treeArrMatch) {
      const items = treeArrMatch[1].split(",").map(s => s.trim());
      const kM = inputStr.match(/\bk\s*=\s*(-?\d+)/);
      return {
        type: "tree",
        data: items,
        k: kM ? parseInt(kM[1], 10) : undefined,
        raw: inputStr
      };
    }
  }

  // 4. Number array: nums = [2, 7, 11, 15] or target = 7, nums = [...]
  const numArrayMatch = inputStr.match(/\[\s*-?\d+(?:\s*,\s*-?\d+)*\s*\]/);
  if (numArrayMatch) {
    try {
      const parsed = JSON.parse(numArrayMatch[0]);
      const targetM = inputStr.match(/target\s*=\s*(-?\d+)/);
      const kM = inputStr.match(/\bk\s*=\s*(-?\d+)/);
      const isLinkedList = inputStr.includes("head =") || inputStr.includes("head=") || inputStr.includes("l1 =");
      return {
        type: isLinkedList ? "linked-list" : "number-array",
        data: parsed,
        target: targetM ? parseInt(targetM[1], 10) : undefined,
        k: kM ? parseInt(kM[1], 10) : undefined,
        raw: inputStr
      };
    } catch (e) {}
  }

  // 5. String: s = "abcabcbb" or s1 = "ab", s2 = "eidbaooo"
  const strMatch = inputStr.match(/\b(?:s|s1|s2|word|str)\s*=\s*\"([^\"]*)\"/);
  if (strMatch) {
    const s = strMatch[1];
    const kM = inputStr.match(/\bk\s*=\s*(-?\d+)/);
    return {
      type: "string",
      data: s.split(""),
      stringVal: s,
      k: kM ? parseInt(kM[1], 10) : undefined,
      raw: inputStr
    };
  }

  // 6. Number: n = 5
  const nMatch = inputStr.match(/\bn\s*=\s*(-?\d+)/);
  if (nMatch) {
    const n = parseInt(nMatch[1], 10);
    const data = [];
    for (let i = 1; i <= Math.min(n, 6); i++) data.push(i);
    return { type: "number", num: n, data, raw: inputStr };
  }

  return { type: "general", data: ["Input", "Process", "Evaluate", "Output"], raw: inputStr };
}

// Universal Pattern Visualizer Synthesizer
// Dynamically builds variable, element-by-element steps based on the actual example data.
export function getProblemVisualizer(problem) {
  if (!problem) return null;

  const desc = problemDescriptions[problem.id];
  const exampleInput = desc?.example?.input || "";
  const exampleOutput = desc?.example?.output || "";
  const exampleExplanation = desc?.example?.explanation || "";

  // 1. If explicit handcrafted visualizer exists, merge with problem's example details
  if (problemVisualizers[problem.id]) {
    const custom = problemVisualizers[problem.id];
    return {
      ...custom,
      exampleInput,
      exampleOutput,
      exampleExplanation,
      keyInsight: problem.keyInsight || ""
    };
  }

  // 2. Parse problem's concrete example input data
  const parsed = parseExampleInput(exampleInput);
  const data = Array.isArray(parsed.data) && parsed.data.length > 0 ? parsed.data : [1, 2, 3];
  const len = data.length;
  const qList = problem.intuition || [];
  const q1 = qList[0]?.q || "How to optimize?";
  const a1 = qList[0]?.a || "Store state in memory structure";
  const q2 = qList[1]?.q || "What invariant to maintain?";
  const a2 = qList[1]?.a || "Eliminate redundant branches in O(N)";

  // Clean code lines for snippet extraction
  const codeLines = (problem.code || "").split("\n").filter(l => l.trim().length > 0);
  const firstCode = codeLines.slice(1, 4).join("\n") || "state = {}";
  const loopCode = codeLines.slice(4, 7).join("\n") || "for item in items:\n    process(item)";
  const returnCode = codeLines.slice(-2).join("\n") || `return ${exampleOutput || "result"}`;

  // Dynamically generate natural, variable-length steps (5 to 7 steps) based on the example data
  const dynamicSteps = [];

  // Step 1: Input Setup & Strategy
  dynamicSteps.push({
    step: 1,
    title: `Step 1: Input Setup & Problem Strategy`,
    description: `Given ${exampleInput}. Our goal is to compute ${exampleOutput}. Key strategy: ${q1} → ${a1}.`,
    highlightIndices: [],
    memoryState: { label: "Goal", data: `Compute ${exampleOutput}` },
    codeSnippet: firstCode
  });

  // Step 2: First element inspection
  dynamicSteps.push({
    step: 2,
    title: `Step 2: Inspect First Element [0] = ${data[0]}`,
    description: `We begin iterating at index 0 with value ${data[0]}. Invariant check: ${a2}.`,
    highlightIndices: [0],
    pointers: { i: 0 },
    memoryState: { label: "Current", data: String(data[0]) },
    codeSnippet: loopCode
  });

  // Step 3: Second element inspection
  if (len > 1) {
    dynamicSteps.push({
      step: 3,
      title: `Step 3: Inspect Next Element [1] = ${data[1]}`,
      description: `Advance to index 1 with value ${data[1]}. State updates according to the "${problem.pattern}" pattern.`,
      highlightIndices: [1],
      pointers: { i: 1 },
      memoryState: { label: "State", data: `Inspecting ${data[1]}` },
      codeSnippet: loopCode
    });
  }

  // Step 4: Midpoint element inspection (if array has 4+ elements)
  if (len >= 4) {
    const midIdx = Math.floor(len / 2);
    dynamicSteps.push({
      step: 4,
      title: `Step 4: Inspect Midpoint Element [${midIdx}] = ${data[midIdx]}`,
      description: `At index ${midIdx} (${data[midIdx]}), maintain invariant: ${problem.keyInsight || a1}.`,
      highlightIndices: [midIdx],
      pointers: { curr: midIdx },
      memoryState: { label: "Invariant", data: a2 },
      codeSnippet: loopCode
    });
  }

  // Step 5: Core Transition / Convergence Step
  const lastCandidateIdx = Math.max(0, len - 2);
  dynamicSteps.push({
    step: dynamicSteps.length + 1,
    title: `Step ${dynamicSteps.length + 1}: Pattern Condition Triggered / Approaching Solution`,
    description: `As the algorithm processes remaining elements up to index ${lastCandidateIdx} (${data[lastCandidateIdx]}), the solution criteria is satisfied: ${problem.keyInsight || "Optimal bounds achieved."}`,
    highlightIndices: [lastCandidateIdx],
    pointers: { i: lastCandidateIdx },
    memoryState: { label: "Status", data: "Condition met" },
    codeSnippet: loopCode
  });

  // Final Step: Return Result
  dynamicSteps.push({
    step: dynamicSteps.length + 1,
    title: `Step ${dynamicSteps.length + 1}: Final Result Computed → ${exampleOutput}`,
    description: `Traversal completes. The algorithm returns the verified result: ${exampleOutput}. ${exampleExplanation ? `Explanation: ${exampleExplanation}` : ""}`,
    highlightIndices: [len - 1],
    matched: true,
    memoryState: { label: "Final Result", data: exampleOutput },
    codeSnippet: returnCode
  });

  // Re-number steps consecutively
  dynamicSteps.forEach((s, idx) => {
    s.step = idx + 1;
  });

  return {
    patternType: parsed.type,
    title: `${problem.pattern || problem.name} Visual Walkthrough`,
    inputData: data,
    target: parsed.target,
    k: parsed.k,
    exampleInput,
    exampleOutput,
    exampleExplanation,
    keyInsight: problem.keyInsight || "",
    steps: dynamicSteps
  };
}
