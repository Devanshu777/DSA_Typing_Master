// Canonical DSA Algorithm Templates for high-velocity muscle memory drilling
// Each template contains recognition signals, complexity benchmarks, core mental models, and drillable Python code.

export const templateCategories = [
  "All",
  "Sliding Window",
  "Two Pointers",
  "Binary Search",
  "Stack",
  "Prefix Sum",
  "Linked List",
  "Trees & Graphs",
  "Backtracking"
];

export const templatesData = [
  // ─── 1. SLIDING WINDOW ───
  {
    id: "fixed-sliding-window",
    name: "Fixed-Size Sliding Window",
    category: "Sliding Window",
    difficulty: "Foundation",
    signals: [
      "contiguous subarray of exact size k",
      "maximum / minimum average of size k",
      "fixed window length given"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    keyInsight: "Never recompute the whole window from scratch. Slide forward by adding the new element on the right and subtracting the old element on the left in O(1).",
    code: `def max_sum_subarray_k(arr: list[int], k: int) -> int:
    if len(arr) < k:
        return 0

    window_sum = sum(arr[:k])
    max_sum = window_sum

    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum`
  },
  {
    id: "variable-sliding-window-longest",
    name: "Variable Window (Find Longest)",
    category: "Sliding Window",
    difficulty: "Foundation",
    signals: [
      "find the longest contiguous subarray / substring",
      "longest substring without repeating characters",
      "at most k distinct elements"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(k)",
    keyInsight: "Expand the window by advancing right. Whenever the window condition is violated (invalid), shrink from left until valid again, updating max length.",
    code: `def longest_substring_k_distinct(s: str, k: int) -> int:
    left = 0
    max_len = 0
    counts = {}

    for right in range(len(s)):
        char = s[right]
        counts[char] = counts.get(char, 0) + 1

        while len(counts) > k:
            left_char = s[left]
            counts[left_char] -= 1
            if counts[left_char] == 0:
                del counts[left_char]
            left += 1

        max_len = max(max_len, right - left + 1)

    return max_len`
  },
  {
    id: "variable-sliding-window-shortest",
    name: "Variable Window (Find Shortest)",
    category: "Sliding Window",
    difficulty: "Intermediate",
    signals: [
      "find the shortest / minimum subarray with sum >= target",
      "minimum window substring containing all characters",
      "shrink when valid to minimize"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    keyInsight: "Expand right until the window becomes VALID. Once valid, immediately shrink from left to find the smallest valid window while recording min_len.",
    code: `def min_subarray_len(target: int, nums: list[int]) -> int:
    left = 0
    current_sum = 0
    min_len = float('inf')

    for right in range(len(nums)):
        current_sum += nums[right]

        while current_sum >= target:
            min_len = min(min_len, right - left + 1)
            current_sum -= nums[left]
            left += 1

    return min_len if min_len != float('inf') else 0`
  },

  // ─── 2. TWO POINTERS ───
  {
    id: "two-pointers-converging",
    name: "Opposite Direction (Converging)",
    category: "Two Pointers",
    difficulty: "Foundation",
    signals: [
      "sorted array pair search",
      "two sum in sorted array (O(1) memory)",
      "container with most water"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    keyInsight: "Because the array is sorted, incrementing left increases the sum, and decrementing right decreases the sum, giving complete deterministic control.",
    code: `def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    left, right = 0, len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return [left + 1, right + 1]
        elif current_sum < target:
            left += 1
        else:
            right -= 1

    return []`
  },
  {
    id: "two-pointers-palindrome",
    name: "Palindrome Verification",
    category: "Two Pointers",
    difficulty: "Foundation",
    signals: [
      "check if string / sequence is palindrome",
      "valid palindrome with character removal",
      "symmetric comparisons inward"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    keyInsight: "Compare characters from outer boundaries moving inward. If pointers meet without mismatch, symmetry holds.",
    code: `def is_valid_palindrome(s: str) -> bool:
    left, right = 0, len(s) - 1

    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1

        if s[left].lower() != s[right].lower():
            return False

        left += 1
        right -= 1

    return True`
  },
  {
    id: "two-pointers-fast-slow",
    name: "Fast & Slow (Read / Write Pointer)",
    category: "Two Pointers",
    difficulty: "Foundation",
    signals: [
      "in-place array modification with O(1) space",
      "remove duplicates from sorted array",
      "move zeroes to end"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    keyInsight: "The fast pointer scans every incoming element (read head), while the slow pointer tracks the boundary of valid output elements (write head).",
    code: `def remove_duplicates(nums: list[int]) -> int:
    if not nums:
        return 0

    write_idx = 1

    for read_idx in range(1, len(nums)):
        if nums[read_idx] != nums[read_idx - 1]:
            nums[write_idx] = nums[read_idx]
            write_idx += 1

    return write_idx`
  },

  // ─── 3. BINARY SEARCH ───
  {
    id: "binary-search-exact",
    name: "Classic Exact Value Search",
    category: "Binary Search",
    difficulty: "Foundation",
    signals: [
      "strictly sorted array lookup",
      "O(log n) search requirement",
      "halving search boundary on each comparison"
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    keyInsight: "Use left <= right when the search space includes single elements. Compute mid safely and jump past mid on misses.",
    code: `def binary_search_exact(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`
  },
  {
    id: "binary-search-first-occurrence",
    name: "Lower Bound (First Occurrence)",
    category: "Binary Search",
    difficulty: "Intermediate",
    signals: [
      "find first position of element in sorted array",
      "find lower bound / insertion index",
      "duplicates present in sorted data"
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    keyInsight: "When nums[mid] == target, do not return immediately! Instead, compress right = mid - 1 to look for an earlier occurrence on the left.",
    code: `def find_first_occurrence(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    result = -1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            result = mid
            right = mid - 1
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return result`
  },
  {
    id: "binary-search-rotated",
    name: "Search in Rotated Sorted Array",
    category: "Binary Search",
    difficulty: "Intermediate",
    signals: [
      "array sorted but rotated at unknown pivot",
      "find target in rotated array in O(log n)",
      "partially ordered search space"
    ],
    timeComplexity: "O(log n)",
    spaceComplexity: "O(1)",
    keyInsight: "In any rotated sorted array, at least one half [left..mid] or [mid..right] is always normally sorted. Identify the sorted half, then check if target is inside.",
    code: `def search_rotated_array(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1`
  },

  // ─── 4. STACK ───
  {
    id: "stack-valid-parentheses",
    name: "Matching Delimiters (Parentheses)",
    category: "Stack",
    difficulty: "Foundation",
    signals: [
      "valid parentheses / brackets",
      "nested tag balancing",
      "LIFO last-opened must be first-closed"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    keyInsight: "Map each closing bracket to its expected opening bracket. Opening brackets push onto stack; closing brackets must pop and match top.",
    code: `def is_valid_parentheses(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}

    for char in s:
        if char in pairs:
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
        else:
            stack.append(char)

    return len(stack) == 0`
  },
  {
    id: "stack-monotonic-next-greater",
    name: "Monotonic Stack (Next Greater Element)",
    category: "Stack",
    difficulty: "Intermediate",
    signals: [
      "find next greater element for each index",
      "daily temperatures (days until warmer)",
      "largest rectangle in histogram"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    keyInsight: "Maintain a stack of indices with decreasing values. When the current element is greater than the stack top, it is the next greater element for that index.",
    code: `def next_greater_element(nums: list[int]) -> list[int]:
    n = len(nums)
    res = [-1] * n
    stack = []

    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            prev_idx = stack.pop()
            res[prev_idx] = nums[i]
        stack.append(i)

    return res`
  },
  {
    id: "stack-min-stack",
    name: "Min Stack (O(1) Retrieval)",
    category: "Stack",
    difficulty: "Foundation",
    signals: [
      "retrieve minimum element in O(1) time",
      "stack with auxiliary state tracking",
      "undoable state history"
    ],
    timeComplexity: "O(1) all ops",
    spaceComplexity: "O(n)",
    keyInsight: "Maintain a parallel min_stack where min_stack[i] records the min value seen up to depth i. Popping restores previous min automatically.",
    code: `class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []

    def push(self, val: int) -> None:
        self.stack.append(val)
        current_min = min(val, self.min_stack[-1] if self.min_stack else val)
        self.min_stack.append(current_min)

    def pop(self) -> None:
        self.stack.pop()
        self.min_stack.pop()

    def top(self) -> int:
        return self.stack[-1]

    def getMin(self) -> int:
        return self.min_stack[-1]`
  },

  // ─── 5. PREFIX SUM ───
  {
    id: "prefix-sum-1d",
    name: "1D Static Range Sum Precomputation",
    category: "Prefix Sum",
    difficulty: "Foundation",
    signals: [
      "immutable array multiple range sum queries",
      "sum of elements between indices left and right in O(1)",
      "cumulative sum lookup"
    ],
    timeComplexity: "O(n) build, O(1) query",
    spaceComplexity: "O(n)",
    keyInsight: "Padding prefix array with prefix[0] = 0 eliminates boundary edge checks when left = 0: sumRange(left, right) = prefix[right + 1] - prefix[left].",
    code: `class NumArray:
    def __init__(self, nums: list[int]):
        self.prefix = [0] * (len(nums) + 1)
        for i in range(len(nums)):
            self.prefix[i + 1] = self.prefix[i] + nums[i]

    def sumRange(self, left: int, right: int) -> int:
        return self.prefix[right + 1] - self.prefix[left]`
  },
  {
    id: "prefix-sum-equals-k",
    name: "Subarray Sum Equals K (With Negatives)",
    category: "Prefix Sum",
    difficulty: "Intermediate",
    signals: [
      "count total continuous subarrays whose sum equals k",
      "array contains negative numbers or zeros",
      "sliding window fails due to non-monotonic sums"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    keyInsight: "If current_sum - previous_sum == k, the subarray between them sums to k! Use a HashMap to count past occurrences of (current_sum - k).",
    code: `from collections import defaultdict

def subarray_sum_equals_k(nums: list[int], k: int) -> int:
    prefix_counts = defaultdict(int)
    prefix_counts[0] = 1
    current_sum = 0
    count = 0

    for num in nums:
        current_sum += num
        count += prefix_counts[current_sum - k]
        prefix_counts[current_sum] += 1

    return count`
  },

  // ─── 6. LINKED LIST ───
  {
    id: "linked-list-fast-slow-cycle",
    name: "Floyd's Fast & Slow Cycle Detection",
    category: "Linked List",
    difficulty: "Foundation",
    signals: [
      "determine if linked list has a cycle in O(1) memory",
      "tortoise and hare pointer chasing",
      "find duplicate number without extra memory"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    keyInsight: "Move slow 1 step and fast 2 steps. If a cycle exists, fast will inevitably lap slow and they will collide.",
    code: `def has_cycle(head) -> bool:
    slow = head
    fast = head

    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True

    return False`
  },
  {
    id: "linked-list-reverse",
    name: "In-Place Linked List Reversal",
    category: "Linked List",
    difficulty: "Foundation",
    signals: [
      "reverse singly linked list in O(1) space",
      "reverse sublist between left and right",
      "palindrome linked list verification"
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
    keyInsight: "Save next_temp before redirecting current.next to prev, then advance prev and curr forward one notch.",
    code: `def reverse_linked_list(head):
    prev = None
    curr = head

    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp

    return prev`
  },

  // ─── 7. TREES & GRAPHS ───
  {
    id: "bfs-level-order",
    name: "BFS Level-Order Queue Traversal",
    category: "Trees & Graphs",
    difficulty: "Foundation",
    signals: [
      "shortest path in unweighted graph",
      "binary tree level order traversal",
      "rotting oranges / multi-source wave expansion"
    ],
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    keyInsight: "Using len(queue) snapshot at the start of each level processes vertices strictly layer-by-layer.",
    code: `from collections import deque

def bfs_level_order(root):
    if not root:
        return []

    result = []
    queue = deque([root])

    while queue:
        level_size = len(queue)
        current_level = []

        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)

        result.append(current_level)

    return result`
  },

  // ─── 8. BACKTRACKING ───
  {
    id: "backtracking-subsets",
    name: "Backtracking (Subsets & Combinations)",
    category: "Backtracking",
    difficulty: "Intermediate",
    signals: [
      "find all subsets / combinations / permutations",
      "exponential decision tree choices",
      "choose -> explore -> unchoose pattern"
    ],
    timeComplexity: "O(2^n)",
    spaceComplexity: "O(n) stack",
    keyInsight: "Standard state restoration: path.append(nums[i]), recurse into backtrack(i + 1, path), then path.pop() to undo state for next branch.",
    code: `def generate_subsets(nums: list[int]) -> list[list[int]]:
    result = []

    def backtrack(start_idx: int, current_path: list[int]):
        result.append(list(current_path))

        for i in range(start_idx, len(nums)):
            current_path.append(nums[i])
            backtrack(i + 1, current_path)
            current_path.pop()

    backtrack(0, [])
    return result`
  }
];

export function getAllTemplates() {
  return templatesData;
}

export function getTemplateById(id) {
  return templatesData.find(t => t.id === id) || null;
}
