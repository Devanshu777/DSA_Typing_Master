// All 82 DSA problems organized by Phase → Day → Problem
// Each problem has: info, intuition (Q&A), and code to type

const problems = {
  phases: [
    {
      id: "phase-1",
      name: "Core Patterns",
      week: 1,
      description: "Foundation patterns that appear in 80% of interview problems",
      days: [
        {
          day: 1,
          pattern: "Arrays + Hashing",
          problems: [
            {
              id: "two-sum",
              name: "Two Sum",
              difficulty: "Easy",
              lcNumber: 1,
              leetcodeUrl: "https://leetcode.com/problems/two-sum/",
              pattern: "HashMap — Value → Index Lookup",
              signals: ["find two numbers that add up to target", "complement lookup"],
              intuition: [
                { q: "What data structure gives O(1) lookup?", a: "dict / HashMap" },
                { q: "What are you looking up?", a: "the complement: target - num" },
                { q: "Why store value → index?", a: "because we need to return indices" }
              ],
              keyInsight: "Instead of checking every pair O(n²), store what you've seen and check if the complement exists — O(n).",
              code: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, n in enumerate(nums):
            complement = target - n
            if complement in seen:
                return [seen[complement], i]
            seen[n] = i
        return []`
            },
            {
              id: "contains-duplicate",
              name: "Contains Duplicate",
              difficulty: "Easy",
              lcNumber: 217,
              leetcodeUrl: "https://leetcode.com/problems/contains-duplicate/",
              pattern: "HashSet — Existence Check",
              signals: ["return true if any value appears at least twice"],
              intuition: [
                { q: "Do you need to count frequency or just check existence?", a: "Just check existence — use a set" },
                { q: "What's the brute force?", a: "O(n²) compare all pairs" },
                { q: "How does a HashSet improve this?", a: "O(1) lookup per element → O(n) total" }
              ],
              keyInsight: "A set gives O(1) lookup. If the element is already in the set, we found a duplicate.",
              code: `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        seen = set()
        for n in nums:
            if n in seen:
                return True
            seen.add(n)
        return False`
            },
            {
              id: "group-anagrams",
              name: "Group Anagrams",
              difficulty: "Medium",
              lcNumber: 49,
              leetcodeUrl: "https://leetcode.com/problems/group-anagrams/",
              pattern: "HashMap — Grouping by Key",
              signals: ["group the anagrams together"],
              intuition: [
                { q: "What makes two strings anagrams?", a: "same characters, same frequency" },
                { q: "What key uniquely identifies an anagram group?", a: "sorted(word) or character frequency tuple" },
                { q: "What data structure maps key → group of words?", a: "defaultdict(list)" }
              ],
              keyInsight: "Sort each word to create a canonical key. All anagrams produce the same sorted key.",
              code: `from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        groups = defaultdict(list)
        for word in strs:
            key = tuple(sorted(word))
            groups[key].append(word)
        return list(groups.values())`
            },
            {
              id: "top-k-frequent",
              name: "Top K Frequent Elements",
              difficulty: "Medium",
              lcNumber: 347,
              leetcodeUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
              pattern: "HashMap + Bucket Sort",
              signals: ["return the k most frequent elements"],
              intuition: [
                { q: "How do you count frequencies?", a: "Counter / HashMap" },
                { q: "How do you find the top K?", a: "Bucket sort — O(n). bucket[i] = elements appearing i times" },
                { q: "Why iterate buckets from right to left?", a: "Highest frequency first → collect k elements" }
              ],
              keyInsight: "Count frequencies, then use bucket sort where index = frequency. Walk buckets from right to left to get top K.",
              code: `from collections import Counter

class Solution:
    def topKFrequent(self, nums: list[int], k: int) -> list[int]:
        count = Counter(nums)
        bucket = [[] for _ in range(len(nums) + 1)]
        for num, freq in count.items():
            bucket[freq].append(num)
        result = []
        for i in range(len(bucket) - 1, 0, -1):
            for n in bucket[i]:
                result.append(n)
                if len(result) == k:
                    return result
        return result`
            }
          ]
        },
        {
          day: 2,
          pattern: "Two Pointers",
          problems: [
            {
              id: "valid-palindrome",
              name: "Valid Palindrome",
              difficulty: "Easy",
              lcNumber: 125,
              leetcodeUrl: "https://leetcode.com/problems/valid-palindrome/",
              pattern: "Opposite Direction — Palindrome Check",
              signals: ["reads the same forward and backward"],
              intuition: [
                { q: "What do you do with non-alphanumeric characters?", a: "Skip them" },
                { q: "What pointer setup do you need?", a: "left = 0, right = end" },
                { q: "When do you return False?", a: "when s[left].lower() != s[right].lower()" }
              ],
              keyInsight: "Two pointers from outside in, skipping non-alnum chars, comparing lowercase.",
              code: `class Solution:
    def isPalindrome(self, s: str) -> bool:
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
              id: "two-sum-ii",
              name: "Two Sum II — Input Array Is Sorted",
              difficulty: "Medium",
              lcNumber: 167,
              leetcodeUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
              pattern: "Opposite Direction — Converging Pointers",
              signals: ["sorted array", "find two numbers that add up to target"],
              intuition: [
                { q: "Why use two pointers instead of HashMap?", a: "Array is sorted → O(1) space with two pointers" },
                { q: "If sum is too small, which pointer moves?", a: "left++ (need bigger number)" },
                { q: "If sum is too big, which pointer moves?", a: "right-- (need smaller number)" },
                { q: "Note: LeetCode uses 1-indexed output!", a: "Return [left+1, right+1]" }
              ],
              keyInsight: "Sorted array → two pointers converge. Too small? Move left up. Too big? Move right down.",
              code: `class Solution:
    def twoSum(self, numbers: list[int], target: int) -> list[int]:
        left, right = 0, len(numbers) - 1
        while left < right:
            current_sum = numbers[left] + numbers[right]
            if current_sum == target:
                return [left + 1, right + 1]
            elif current_sum < target:
                left += 1
            else:
                right -= 1
        return []`
            },
            {
              id: "3sum",
              name: "3Sum",
              difficulty: "Medium",
              lcNumber: 15,
              leetcodeUrl: "https://leetcode.com/problems/3sum/",
              pattern: "Fix One + Two Pointers",
              signals: ["find all unique triplets that sum to zero"],
              intuition: [
                { q: "What must you do first?", a: "Sort the array" },
                { q: "What is 3Sum reduced to?", a: "A loop of Two Sums" },
                { q: "Where do you skip duplicates?", a: "3 places: i, left, right" },
                { q: "What is the target for the inner Two Sum?", a: "-nums[i]" }
              ],
              keyInsight: "Sort → fix one element → two-pointer on the rest. Skip duplicates at all three positions.",
              code: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            left = i + 1
            right = len(nums) - 1
            target = -nums[i]
            while left < right:
                curr_sum = nums[left] + nums[right]
                if curr_sum == target:
                    result.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
                elif curr_sum < target:
                    left += 1
                else:
                    right -= 1
        return result`
            }
          ]
        },
        {
          day: 3,
          pattern: "Sliding Window",
          problems: [
            {
              id: "max-average-subarray-i",
              name: "Maximum Average Subarray I",
              difficulty: "Easy",
              lcNumber: 643,
              leetcodeUrl: "https://leetcode.com/problems/maximum-average-subarray-i/",
              pattern: "Sliding Window — Fixed-Size Window",
              signals: ["maximum average value", "contiguous subarray of given length k"],
              intuition: [
                { q: "Is window size fixed or variable?", a: "Fixed size k" },
                { q: "How do you calculate the initial window?", a: "Sum of first k elements" },
                { q: "How do you slide the window efficiently?", a: "Add nums[i] and subtract nums[i - k]" }
              ],
              keyInsight: "Slide the window by adding the incoming element at right and subtracting outgoing at left: window_sum += nums[i] - nums[i - k].",
              code: `class Solution:
    def findMaxAverage(self, nums: list[int], k: int) -> float:
        window_sum = sum(nums[:k])
        max_sum = window_sum
        for i in range(k, len(nums)):
            window_sum += nums[i] - nums[i - k]
            max_sum = max(max_sum, window_sum)
        return max_sum / k`
            },
            {
              id: "longest-substring-no-repeat",
              name: "Longest Substring Without Repeating Characters",
              difficulty: "Medium",
              lcNumber: 3,
              leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
              pattern: "Sliding Window — Variable-Size (Longest)",
              signals: ["longest substring", "without repeating"],
              intuition: [
                { q: "What makes the window invalid?", a: "A duplicate character in current window" },
                { q: "What data structure checks duplicates in O(1)?", a: "A set or dictionary" },
                { q: "When do you shrink?", a: "While s[right] is already in seen set" }
              ],
              keyInsight: "Expand right until invalid. Shrink left until valid again. Maximize window size right - left + 1.",
              code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = set()
        left = 0
        max_len = 0
        for right in range(len(s)):
            while s[right] in seen:
                seen.remove(s[left])
                left += 1
            seen.add(s[right])
            max_len = max(max_len, right - left + 1)
        return max_len`
            },
            {
              id: "min-size-subarray-sum",
              name: "Minimum Size Subarray Sum",
              difficulty: "Medium",
              lcNumber: 209,
              leetcodeUrl: "https://leetcode.com/problems/minimum-size-subarray-sum/",
              pattern: "Sliding Window — Variable-Size (Shortest)",
              signals: ["minimal length", "subarray sum greater than or equal to target"],
              intuition: [
                { q: "For shortest window, when do you shrink?", a: "Shrink when VALID (window_sum >= target) to minimize size" },
                { q: "How do you expand the window?", a: "Add nums[right] to window_sum" },
                { q: "What if no subarray meets the target?", a: "Return 0 if min_len was never updated" }
              ],
              keyInsight: "For shortest window: expand right until valid, then shrink left while valid to find minimal length.",
              code: `class Solution:
    def minSubArrayLen(self, target: int, nums: list[int]) -> int:
        left = 0
        window_sum = 0
        min_len = float('inf')
        for right in range(len(nums)):
            window_sum += nums[right]
            while window_sum >= target:
                min_len = min(min_len, right - left + 1)
                window_sum -= nums[left]
                left += 1
        return min_len if min_len != float('inf') else 0`
            },
            {
              id: "permutation-in-string",
              name: "Permutation in String",
              difficulty: "Medium",
              lcNumber: 567,
              leetcodeUrl: "https://leetcode.com/problems/permutation-in-string/",
              pattern: "Sliding Window — Fixed-Size (Frequency Match)",
              signals: ["contains a permutation of s1", "anagram substring"],
              intuition: [
                { q: "What is the fixed window length?", a: "len(s1)" },
                { q: "What defines a permutation?", a: "Identical character counts" },
                { q: "How to maintain frequencies efficiently?", a: "Add right char, remove left char from window Counter" }
              ],
              keyInsight: "Window size is fixed to len(s1). Slide window of length k across s2 comparing frequency counters.",
              code: `from collections import Counter

class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        if len(s1) > len(s2):
            return False
        s1_count = Counter(s1)
        window_count = Counter(s2[:len(s1)])
        if s1_count == window_count:
            return True
        k = len(s1)
        for i in range(k, len(s2)):
            window_count[s2[i]] += 1
            window_count[s2[i - k]] -= 1
            if window_count[s2[i - k]] == 0:
                del window_count[s2[i - k]]
            if window_count == s1_count:
                return True
        return False`
            },
            {
              id: "max-consecutive-ones-iii",
              name: "Max Consecutive Ones III",
              difficulty: "Medium",
              lcNumber: 1004,
              leetcodeUrl: "https://leetcode.com/problems/max-consecutive-ones-iii/",
              pattern: "Sliding Window — At Most K Inversions",
              signals: ["maximum number of consecutive 1s", "flip at most k 0s"],
              intuition: [
                { q: "How to rephrase the problem?", a: "Find longest window containing at most k zeros" },
                { q: "When is the window invalid?", a: "When zero_count > k" },
                { q: "How to shrink?", a: "Move left pointer; if nums[left] == 0, decrement zero_count" }
              ],
              keyInsight: "Maintain a window with at most k zeros. If zeros > k, shrink from left until zeros <= k.",
              code: `class Solution:
    def longestOnes(self, nums: list[int], k: int) -> int:
        left = 0
        zeros = 0
        max_len = 0
        for right in range(len(nums)):
            if nums[right] == 0:
                zeros += 1
            while zeros > k:
                if nums[left] == 0:
                    zeros -= 1
                left += 1
            max_len = max(max_len, right - left + 1)
        return max_len`
            },
            {
              id: "fruit-into-baskets",
              name: "Fruit Into Baskets",
              difficulty: "Medium",
              lcNumber: 904,
              leetcodeUrl: "https://leetcode.com/problems/fruit-into-baskets/",
              pattern: "Sliding Window — At Most 2 Distinct Elements",
              signals: ["two baskets", "each basket holds one type", "maximum fruits"],
              intuition: [
                { q: "What is the equivalent string problem?", a: "Longest subarray with at most 2 distinct integers" },
                { q: "What tracks distinct fruit counts?", a: "defaultdict(int) or Counter" },
                { q: "When do you shrink?", a: "While len(count) > 2, decrement count[fruits[left]] and delete when 0" }
              ],
              keyInsight: "Find longest subarray with at most 2 unique numbers. Shrink left when unique count exceeds 2.",
              code: `from collections import defaultdict

class Solution:
    def totalFruit(self, fruits: list[int]) -> int:
        count = defaultdict(int)
        left = 0
        max_fruits = 0
        for right in range(len(fruits)):
            count[fruits[right]] += 1
            while len(count) > 2:
                count[fruits[left]] -= 1
                if count[fruits[left]] == 0:
                    del count[fruits[left]]
                left += 1
            max_fruits = max(max_fruits, right - left + 1)
        return max_fruits`
            },
            {
              id: "longest-repeating-char-replacement",
              name: "Longest Repeating Character Replacement",
              difficulty: "Medium",
              lcNumber: 424,
              leetcodeUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/",
              pattern: "Sliding Window — Window Size Minus Max Frequency",
              signals: ["replace at most k characters", "longest substring same letter"],
              intuition: [
                { q: "What is the key window validity formula?", a: "(window_size - max_frequency) <= k" },
                { q: "Why max_frequency?", a: "It is optimal to convert other characters to the most frequent character" },
                { q: "When do you shrink?", a: "When (right - left + 1) - max_freq > k" }
              ],
              keyInsight: "Number of replacements needed = window_length - max_freq. If replacements > k, shrink from left.",
              code: `from collections import defaultdict

class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        count = defaultdict(int)
        left = 0
        max_freq = 0
        max_len = 0
        for right in range(len(s)):
            count[s[right]] += 1
            max_freq = max(max_freq, count[s[right]])
            while (right - left + 1) - max_freq > k:
                count[s[left]] -= 1
                left += 1
            max_len = max(max_len, right - left + 1)
        return max_len`
            },
            {
              id: "subarrays-with-k-different-integers",
              name: "Subarrays with K Different Integers",
              difficulty: "Hard",
              lcNumber: 992,
              leetcodeUrl: "https://leetcode.com/problems/subarrays-with-k-different-integers/",
              pattern: "Sliding Window — Exact K = atMost(k) - atMost(k - 1)",
              signals: ["number of good subarrays", "exactly k different integers"],
              intuition: [
                { q: "Why is 'exactly k' hard with a single window?", a: "Shrinking can still leave k distinct elements; non-monotonic" },
                { q: "How do we solve 'exact k' problems?", a: "exact(k) = atMost(k) - atMost(k - 1)" },
                { q: "How many valid subarrays end at 'right' in atMost(k)?", a: "right - left + 1" }
              ],
              keyInsight: "Exact(k) = atMost(k) - atMost(k - 1). In atMost(k), each valid window adds (right - left + 1) subarrays.",
              code: `from collections import defaultdict

class Solution:
    def subarraysWithKDistinct(self, nums: list[int], k: int) -> int:
        def atMost(k_distinct: int) -> int:
            if k_distinct <= 0:
                return 0
            count = defaultdict(int)
            left = 0
            total = 0
            for right in range(len(nums)):
                count[nums[right]] += 1
                while len(count) > k_distinct:
                    count[nums[left]] -= 1
                    if count[nums[left]] == 0:
                        del count[nums[left]]
                    left += 1
                total += right - left + 1
            return total

        return atMost(k) - atMost(k - 1)`
            },
            {
              id: "minimum-window-substring",
              name: "Minimum Window Substring",
              difficulty: "Hard",
              lcNumber: 76,
              leetcodeUrl: "https://leetcode.com/problems/minimum-window-substring/",
              pattern: "Sliding Window — Shortest Valid Window",
              signals: ["minimum window in s", "contains all characters in t"],
              intuition: [
                { q: "How do you know the window contains all characters?", a: "Track have == need match count for character frequencies" },
                { q: "When do you shrink?", a: "While window is VALID (have == need), record min length and shrink left" },
                { q: "When do you stop shrinking?", a: "When removing s[left] causes have < need" }
              ],
              keyInsight: "Expand right until have == need. Then shrink left while have == need, updating the minimum window.",
              code: `from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if not s or not t or len(s) < len(t):
            return ""
        target_count = Counter(t)
        window_count = Counter()
        have, need = 0, len(target_count)
        res_len = float('inf')
        res = [-1, -1]
        left = 0
        for right in range(len(s)):
            char = s[right]
            window_count[char] += 1
            if char in target_count and window_count[char] == target_count[char]:
                have += 1
            while have == need:
                if (right - left + 1) < res_len:
                    res = [left, right]
                    res_len = right - left + 1
                window_count[s[left]] -= 1
                if s[left] in target_count and window_count[s[left]] < target_count[s[left]]:
                    have -= 1
                left += 1
        l, r = res
        return s[l:r + 1] if res_len != float('inf') else ""`
            }
          ]
        },
        {
          day: 4,
          pattern: "Stack",
          problems: [
            {
              id: "valid-parentheses",
              name: "Valid Parentheses",
              difficulty: "Easy",
              lcNumber: 20,
              leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
              pattern: "Stack — LIFO Matching",
              signals: ["open brackets must be closed by same type", "closed in correct order"],
              intuition: [
                { q: "When do you push to the stack?", a: "When encountering an opening bracket: (, {, [" },
                { q: "When do you pop?", a: "When encountering a closing bracket: ), }, ]" },
                { q: "What causes an immediate return False?", a: "Closing bracket when stack is empty, or top does not match" },
                { q: "What must be true at the end?", a: "Stack must be empty" }
              ],
              keyInsight: "Use a stack. Push opens, pop on closes. If mismatch or empty stack on close → False.",
              code: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        matching = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in matching:
                if not stack or stack[-1] != matching[char]:
                    return False
                stack.pop()
            else:
                stack.append(char)
        return len(stack) == 0`
            },
            {
              id: "min-stack",
              name: "Min Stack",
              difficulty: "Medium",
              lcNumber: 155,
              leetcodeUrl: "https://leetcode.com/problems/min-stack/",
              pattern: "Stack with Auxiliary Tracking",
              signals: ["retrieve minimum element in O(1) time"],
              intuition: [
                { q: "Why doesn't a single min_val variable work?", a: "When you pop the min, you won't know the previous min!" },
                { q: "How do you remember the minimum history?", a: "Push tuples (val, current_min) to a single stack" },
                { q: "What are the time complexities?", a: "push, pop, top, getMin — all O(1)" }
              ],
              keyInsight: "Store (value, current_min) pairs. Each entry remembers what the min was at that point.",
              code: `class MinStack:
    def __init__(self):
        self.stack = []

    def push(self, val: int) -> None:
        current_min = min(val, self.stack[-1][1] if self.stack else val)
        self.stack.append((val, current_min))

    def pop(self) -> None:
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1][0]

    def getMin(self) -> int:
        return self.stack[-1][1]`
            },
            {
              id: "eval-reverse-polish",
              name: "Evaluate Reverse Polish Notation",
              difficulty: "Medium",
              lcNumber: 150,
              leetcodeUrl: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
              pattern: "Stack — Expression Evaluation",
              signals: ["postfix notation", "operators follow operands"],
              intuition: [
                { q: "When you see a number, what do you do?", a: "Convert to int and push to stack" },
                { q: "When you see an operator, which operand is popped first?", a: "Second operand b = pop(), then first operand a = pop()" },
                { q: "How does division work?", a: "Truncates toward zero: int(a / b) not a // b" }
              ],
              keyInsight: "Numbers → push. Operators → pop two, compute, push result. Order matters for - and /.",
              code: `class Solution:
    def evalRPN(self, tokens: list[str]) -> int:
        stack = []
        for token in tokens:
            if token in "+-*/":
                b = stack.pop()
                a = stack.pop()
                if token == '+':
                    stack.append(a + b)
                elif token == '-':
                    stack.append(a - b)
                elif token == '*':
                    stack.append(a * b)
                elif token == '/':
                    stack.append(int(a / b))
            else:
                stack.append(int(token))
        return stack[0]`
            }
          ]
        },
        {
          day: 5,
          pattern: "Binary Search",
          problems: [
            {
              id: "binary-search",
              name: "Binary Search",
              difficulty: "Easy",
              lcNumber: 704,
              leetcodeUrl: "https://leetcode.com/problems/binary-search/",
              pattern: "Classic Binary Search",
              signals: ["sorted array", "O(log n) runtime"],
              intuition: [
                { q: "What are your initial left and right?", a: "left = 0, right = len(nums) - 1" },
                { q: "Why left <= right instead of left < right?", a: "When left == right, there's still 1 element to check" },
                { q: "How do you adjust boundaries?", a: "nums[mid] < target: left = mid + 1. nums[mid] > target: right = mid - 1" }
              ],
              keyInsight: "Halve the search space each step. Compare mid, adjust left or right.",
              code: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
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
              id: "search-rotated-array",
              name: "Search in Rotated Sorted Array",
              difficulty: "Medium",
              lcNumber: 33,
              leetcodeUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
              pattern: "Modified Binary Search",
              signals: ["sorted in ascending order", "rotated at unknown pivot", "O(log n)"],
              intuition: [
                { q: "What's true about the two halves around mid?", a: "At least ONE half is always sorted" },
                { q: "How check if left half is sorted?", a: "nums[left] <= nums[mid]" },
                { q: "If left half sorted, how check if target is in it?", a: "nums[left] <= target < nums[mid]" },
                { q: "If target not in sorted half?", a: "It must be in the other half" }
              ],
              keyInsight: "One half is always sorted. Check if target is in the sorted half, otherwise search the other.",
              code: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
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
            {
              id: "find-min-rotated",
              name: "Find Minimum in Rotated Sorted Array",
              difficulty: "Medium",
              lcNumber: 153,
              leetcodeUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
              pattern: "Binary Search — Boundary Convergence",
              signals: ["sorted rotated", "find minimum", "O(log n)"],
              intuition: [
                { q: "Which element do you compare nums[mid] against?", a: "Always compare with nums[right]" },
                { q: "If nums[mid] > nums[right], where is the min?", a: "To the right: left = mid + 1" },
                { q: "If nums[mid] <= nums[right], where is the min?", a: "Could be mid or left: right = mid" },
                { q: "Why while left < right?", a: "When left == right, search space converged to the min" }
              ],
              keyInsight: "Compare mid with right. If mid > right, min is in right half. Otherwise, min is in left half (including mid).",
              code: `class Solution:
    def findMin(self, nums: list[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        return nums[left]`
            }
          ]
        },
        {
          day: 6,
          pattern: "Prefix Sum",
          problems: [
            {
              id: "range-sum-query",
              name: "Range Sum Query — Immutable",
              difficulty: "Easy",
              lcNumber: 303,
              leetcodeUrl: "https://leetcode.com/problems/range-sum-query-immutable/",
              pattern: "1D Prefix Sum Array",
              signals: ["multiple queries for sum between indices"],
              intuition: [
                { q: "Why is sum(nums[left:right+1]) too slow?", a: "Each query O(n), giving O(n * q) total" },
                { q: "What size prefix array to build?", a: "len(nums) + 1, starting with prefix[0] = 0" },
                { q: "How to get sumRange(left, right) in O(1)?", a: "prefix[right + 1] - prefix[left]" }
              ],
              keyInsight: "Precompute prefix sums once O(n), then answer any range query in O(1).",
              code: `class NumArray:
    def __init__(self, nums: list[int]):
        self.prefix = [0]
        for num in nums:
            self.prefix.append(self.prefix[-1] + num)

    def sumRange(self, left: int, right: int) -> int:
        return self.prefix[right + 1] - self.prefix[left]`
            },
            {
              id: "subarray-sum-equals-k",
              name: "Subarray Sum Equals K",
              difficulty: "Medium",
              lcNumber: 560,
              leetcodeUrl: "https://leetcode.com/problems/subarray-sum-equals-k/",
              pattern: "Prefix Sum + HashMap",
              signals: ["continuous subarray sum equals k", "negative numbers"],
              intuition: [
                { q: "Why can't you use sliding window?", a: "Negative numbers break monotonicity" },
                { q: "What formula relates prefix sums and k?", a: "current_sum - previous_sum = k → previous_sum = current_sum - k" },
                { q: "Why initialize map with {0: 1}?", a: "Handles subarrays starting from index 0 that sum to k" }
              ],
              keyInsight: "Track running sum. At each point, check how many previous prefix sums equal current_sum - k.",
              code: `from collections import defaultdict

class Solution:
    def subarraySum(self, nums: list[int], k: int) -> int:
        count = 0
        current_sum = 0
        prefix_counts = defaultdict(int)
        prefix_counts[0] = 1
        for num in nums:
            current_sum += num
            count += prefix_counts[current_sum - k]
            prefix_counts[current_sum] += 1
        return count`
            }
          ]
        }
      ]
    },
    {
      id: "phase-2",
      name: "Trees & Linked Lists",
      week: 2,
      description: "Pointer manipulation and recursive tree traversals",
      days: [
        {
          day: 8,
          pattern: "Linked List",
          problems: [
            {
              id: "reverse-linked-list",
              name: "Reverse Linked List",
              difficulty: "Easy",
              lcNumber: 206,
              leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
              pattern: "Iterative Reversal",
              signals: ["reverse a singly linked list"],
              intuition: [
                { q: "What three pointers do you need?", a: "prev (starts None), curr (starts head), next_node (temp)" },
                { q: "What's the core operation?", a: "curr.next = prev (reverse the arrow)" },
                { q: "What do you return?", a: "prev (it becomes the new head)" }
              ],
              keyInsight: "Three pointers: prev, curr, next. Reverse each arrow, advance all three, return prev.",
              code: `class Solution:
    def reverseList(self, head):
        prev = None
        curr = head
        while curr:
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        return prev`
            },
            {
              id: "merge-two-sorted-lists",
              name: "Merge Two Sorted Lists",
              difficulty: "Easy",
              lcNumber: 21,
              leetcodeUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
              pattern: "Dummy Head Merge",
              signals: ["merge two sorted linked lists"],
              intuition: [
                { q: "Why use a dummy node?", a: "Avoids special-casing the head of the result" },
                { q: "How do you pick which node comes next?", a: "Compare list1.val vs list2.val, take the smaller" },
                { q: "What about remaining nodes?", a: "Attach whichever list still has nodes" }
              ],
              keyInsight: "Dummy head simplifies edge cases. Compare and link smaller node. Attach leftover at end.",
              code: `class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = ListNode(0)
        curr = dummy
        while list1 and list2:
            if list1.val <= list2.val:
                curr.next = list1
                list1 = list1.next
            else:
                curr.next = list2
                list2 = list2.next
            curr = curr.next
        curr.next = list1 or list2
        return dummy.next`
            },
            {
              id: "remove-nth-from-end",
              name: "Remove Nth Node From End of List",
              difficulty: "Medium",
              lcNumber: 19,
              leetcodeUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
              pattern: "Two Pointers with Gap",
              signals: ["remove the nth node from the end"],
              intuition: [
                { q: "How to find nth from end in one pass?", a: "Two pointers with n-gap between them" },
                { q: "Why use a dummy node?", a: "Handles removing the head node" },
                { q: "When fast reaches end, where is slow?", a: "Right before the node to remove" }
              ],
              keyInsight: "Advance fast pointer n steps ahead. Then move both until fast hits end. Slow is at the node before target.",
              code: `class Solution:
    def removeNthFromEnd(self, head, n: int):
        dummy = ListNode(0, head)
        fast = dummy
        slow = dummy
        for _ in range(n + 1):
            fast = fast.next
        while fast:
            fast = fast.next
            slow = slow.next
        slow.next = slow.next.next
        return dummy.next`
            }
          ]
        },
        {
          day: 9,
          pattern: "Fast/Slow Pointer",
          problems: [
            {
              id: "linked-list-cycle",
              name: "Linked List Cycle",
              difficulty: "Easy",
              lcNumber: 141,
              leetcodeUrl: "https://leetcode.com/problems/linked-list-cycle/",
              pattern: "Floyd's Cycle Detection",
              signals: ["determine if linked list has a cycle"],
              intuition: [
                { q: "How does fast/slow detect a cycle?", a: "If there's a cycle, fast will eventually lap slow" },
                { q: "What speeds do they move at?", a: "slow: 1 step, fast: 2 steps" },
                { q: "When does the loop end without a cycle?", a: "fast or fast.next becomes None" }
              ],
              keyInsight: "Tortoise and hare. If they meet, there's a cycle. If fast hits None, no cycle.",
              code: `class Solution:
    def hasCycle(self, head) -> bool:
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
              id: "middle-linked-list",
              name: "Middle of the Linked List",
              difficulty: "Easy",
              lcNumber: 876,
              leetcodeUrl: "https://leetcode.com/problems/middle-of-the-linked-list/",
              pattern: "Fast/Slow — Middle Finding",
              signals: ["return the middle node"],
              intuition: [
                { q: "When fast reaches end, where is slow?", a: "At the middle" },
                { q: "Why does this work?", a: "Fast moves 2x speed, so slow is at half when fast finishes" },
                { q: "For even length, which middle?", a: "The second middle node" }
              ],
              keyInsight: "Fast moves 2 steps, slow moves 1. When fast finishes, slow is at middle.",
              code: `class Solution:
    def middleNode(self, head):
        slow = head
        fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        return slow`
            },
            {
              id: "happy-number",
              name: "Happy Number",
              difficulty: "Easy",
              lcNumber: 202,
              leetcodeUrl: "https://leetcode.com/problems/happy-number/",
              pattern: "Cycle Detection (no linked list needed)",
              signals: ["loops endlessly in a cycle", "reaches 1"],
              intuition: [
                { q: "What's the 'next node' here?", a: "Sum of squares of digits" },
                { q: "How does fast/slow apply to numbers?", a: "Compute next twice for fast, once for slow" },
                { q: "When is the number happy?", a: "When slow reaches 1" }
              ],
              keyInsight: "The sequence of digit-square-sums either reaches 1 or enters a cycle. Use Floyd's detection.",
              code: `class Solution:
    def isHappy(self, n: int) -> bool:
        def get_next(num):
            total = 0
            while num > 0:
                digit = num % 10
                total += digit * digit
                num //= 10
            return total

        slow = n
        fast = get_next(n)
        while fast != 1 and slow != fast:
            slow = get_next(slow)
            fast = get_next(get_next(fast))
        return fast == 1`
            }
          ]
        },
        {
          day: 10,
          pattern: "Tree DFS",
          problems: [
            {
              id: "invert-binary-tree",
              name: "Invert Binary Tree",
              difficulty: "Easy",
              lcNumber: 226,
              leetcodeUrl: "https://leetcode.com/problems/invert-binary-tree/",
              pattern: "Recursive DFS — Swap Children",
              signals: ["invert a binary tree", "mirror"],
              intuition: [
                { q: "What's the base case?", a: "If node is None, return None" },
                { q: "What do you swap?", a: "node.left and node.right" },
                { q: "Do you swap before or after recursing?", a: "Either works — swap then recurse on both children" }
              ],
              keyInsight: "At each node, swap left and right children, then recurse on both.",
              code: `class Solution:
    def invertTree(self, root):
        if not root:
            return None
        root.left, root.right = root.right, root.left
        self.invertTree(root.left)
        self.invertTree(root.right)
        return root`
            },
            {
              id: "max-depth-binary-tree",
              name: "Maximum Depth of Binary Tree",
              difficulty: "Easy",
              lcNumber: 104,
              leetcodeUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
              pattern: "Recursive DFS — Bottom-Up",
              signals: ["maximum depth", "number of nodes along longest path"],
              intuition: [
                { q: "What's the base case?", a: "Empty node → depth 0" },
                { q: "What's the recurrence?", a: "1 + max(depth(left), depth(right))" },
                { q: "Is this top-down or bottom-up?", a: "Bottom-up: compute children first, then combine" }
              ],
              keyInsight: "Depth = 1 + max of left and right subtree depths. Base case: None → 0.",
              code: `class Solution:
    def maxDepth(self, root) -> int:
        if not root:
            return 0
        return 1 + max(
            self.maxDepth(root.left),
            self.maxDepth(root.right)
        )`
            },
            {
              id: "diameter-binary-tree",
              name: "Diameter of Binary Tree",
              difficulty: "Easy",
              lcNumber: 543,
              leetcodeUrl: "https://leetcode.com/problems/diameter-of-binary-tree/",
              pattern: "DFS with Global Variable",
              signals: ["diameter", "longest path between any two nodes"],
              intuition: [
                { q: "Is diameter always through root?", a: "No — it can be in any subtree" },
                { q: "At each node, what's the path length through it?", a: "left_height + right_height" },
                { q: "What do you return vs what do you track?", a: "Return height (for parent), track diameter (global max)" }
              ],
              keyInsight: "At each node: diameter through it = left_height + right_height. Track global max. Return height.",
              code: `class Solution:
    def diameterOfBinaryTree(self, root) -> int:
        self.diameter = 0

        def dfs(node):
            if not node:
                return 0
            left = dfs(node.left)
            right = dfs(node.right)
            self.diameter = max(self.diameter, left + right)
            return 1 + max(left, right)

        dfs(root)
        return self.diameter`
            }
          ]
        },
        {
          day: 11,
          pattern: "Tree BFS",
          problems: [
            {
              id: "level-order-traversal",
              name: "Binary Tree Level Order Traversal",
              difficulty: "Medium",
              lcNumber: 102,
              leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
              pattern: "BFS with Level Tracking",
              signals: ["level order traversal", "return values grouped by level"],
              intuition: [
                { q: "What data structure for BFS?", a: "Queue (collections.deque)" },
                { q: "How do you know when a level ends?", a: "Process exactly len(queue) nodes per iteration" },
                { q: "What do you add to the queue?", a: "Left and right children of each processed node" }
              ],
              keyInsight: "BFS with queue. Process level_size nodes per loop iteration. Collect each level in a list.",
              code: `from collections import deque

class Solution:
    def levelOrder(self, root):
        if not root:
            return []
        result = []
        queue = deque([root])
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            result.append(level)
        return result`
            },
            {
              id: "right-side-view",
              name: "Binary Tree Right Side View",
              difficulty: "Medium",
              lcNumber: 199,
              leetcodeUrl: "https://leetcode.com/problems/binary-tree-right-side-view/",
              pattern: "BFS — Last Node Per Level",
              signals: ["right side view", "standing on the right side"],
              intuition: [
                { q: "What do you see from the right?", a: "The last node at each level" },
                { q: "How to get the last node per level?", a: "BFS level-by-level, take the last element" },
                { q: "Alternative approach?", a: "DFS going right first, tracking depth" }
              ],
              keyInsight: "Level-order BFS. The last node processed in each level is visible from the right.",
              code: `from collections import deque

class Solution:
    def rightSideView(self, root):
        if not root:
            return []
        result = []
        queue = deque([root])
        while queue:
            level_size = len(queue)
            for i in range(level_size):
                node = queue.popleft()
                if i == level_size - 1:
                    result.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        return result`
            }
          ]
        },
        {
          day: 12,
          pattern: "BST",
          problems: [
            {
              id: "validate-bst",
              name: "Validate Binary Search Tree",
              difficulty: "Medium",
              lcNumber: 98,
              leetcodeUrl: "https://leetcode.com/problems/validate-binary-search-tree/",
              pattern: "DFS with Valid Range",
              signals: ["determine if valid BST"],
              intuition: [
                { q: "Can you just check node > left and node < right?", a: "No — must check against entire ancestor range" },
                { q: "What range does each node have?", a: "min_val < node.val < max_val, inherited from ancestors" },
                { q: "What are the initial bounds?", a: "(-infinity, +infinity)" }
              ],
              keyInsight: "Pass valid range (low, high) down. Each node must be within its range. Update range for children.",
              code: `class Solution:
    def isValidBST(self, root) -> bool:
        def validate(node, low, high):
            if not node:
                return True
            if not (low < node.val < high):
                return False
            return (validate(node.left, low, node.val) and
                    validate(node.right, node.val, high))

        return validate(root, float('-inf'), float('inf'))`
            },
            {
              id: "kth-smallest-bst",
              name: "Kth Smallest Element in a BST",
              difficulty: "Medium",
              lcNumber: 230,
              leetcodeUrl: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
              pattern: "Inorder Traversal",
              signals: ["kth smallest", "BST"],
              intuition: [
                { q: "What traversal gives BST elements in sorted order?", a: "Inorder (left → root → right)" },
                { q: "When do you stop?", a: "After visiting k nodes" },
                { q: "Iterative or recursive?", a: "Iterative with stack is cleaner for early stopping" }
              ],
              keyInsight: "Inorder traversal of BST = sorted order. Do inorder, count to k, return that element.",
              code: `class Solution:
    def kthSmallest(self, root, k: int) -> int:
        stack = []
        curr = root
        count = 0
        while stack or curr:
            while curr:
                stack.append(curr)
                curr = curr.left
            curr = stack.pop()
            count += 1
            if count == k:
                return curr.val
            curr = curr.right`
            },
            {
              id: "lca-bst",
              name: "Lowest Common Ancestor of a BST",
              difficulty: "Medium",
              lcNumber: 235,
              leetcodeUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
              pattern: "BST Property Navigation",
              signals: ["lowest common ancestor", "BST"],
              intuition: [
                { q: "If both p and q are smaller than root?", a: "LCA is in the left subtree" },
                { q: "If both are larger?", a: "LCA is in the right subtree" },
                { q: "If they split (one left, one right)?", a: "Current node IS the LCA" }
              ],
              keyInsight: "Use BST property. If both targets are left, go left. Both right, go right. Split point = LCA.",
              code: `class Solution:
    def lowestCommonAncestor(self, root, p, q):
        curr = root
        while curr:
            if p.val < curr.val and q.val < curr.val:
                curr = curr.left
            elif p.val > curr.val and q.val > curr.val:
                curr = curr.right
            else:
                return curr`
            }
          ]
        },
        {
          day: 13,
          pattern: "Heap / Priority Queue",
          problems: [
            {
              id: "kth-largest",
              name: "Kth Largest Element in an Array",
              difficulty: "Medium",
              lcNumber: 215,
              leetcodeUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
              pattern: "Min-Heap of Size K",
              signals: ["kth largest element"],
              intuition: [
                { q: "Why min-heap of size k, not max-heap?", a: "Min-heap of k: root is kth largest. Smaller elements get evicted." },
                { q: "When do you push/pop?", a: "Push every element. If heap > k, pop the smallest." },
                { q: "What's at the top at the end?", a: "The kth largest element" }
              ],
              keyInsight: "Maintain a min-heap of size k. Top of heap = kth largest. O(n log k).",
              code: `import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        heap = []
        for num in nums:
            heapq.heappush(heap, num)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap[0]`
            },
            {
              id: "last-stone-weight",
              name: "Last Stone Weight",
              difficulty: "Easy",
              lcNumber: 1046,
              leetcodeUrl: "https://leetcode.com/problems/last-stone-weight/",
              pattern: "Max-Heap Simulation",
              signals: ["smash two heaviest stones", "last stone weight"],
              intuition: [
                { q: "Why max-heap?", a: "Always need the two largest stones" },
                { q: "Python only has min-heap. How to simulate max?", a: "Negate all values" },
                { q: "When do you stop?", a: "When 0 or 1 stones remain" }
              ],
              keyInsight: "Negate values for max-heap in Python. Pop two largest, push difference if not equal.",
              code: `import heapq

class Solution:
    def lastStoneWeight(self, stones: list[int]) -> int:
        heap = [-s for s in stones]
        heapq.heapify(heap)
        while len(heap) > 1:
            first = -heapq.heappop(heap)
            second = -heapq.heappop(heap)
            if first != second:
                heapq.heappush(heap, -(first - second))
        return -heap[0] if heap else 0`
            },
            {
              id: "k-closest-points",
              name: "K Closest Points to Origin",
              difficulty: "Medium",
              lcNumber: 973,
              leetcodeUrl: "https://leetcode.com/problems/k-closest-points-to-origin/",
              pattern: "Max-Heap of Size K",
              signals: ["k closest points to origin"],
              intuition: [
                { q: "How to compute distance?", a: "x² + y² (no need for sqrt — just compare squared distances)" },
                { q: "Why max-heap of size k?", a: "Evict the farthest point when heap exceeds k" },
                { q: "What's in the heap?", a: "(-distance, x, y) — negate for max-heap behavior" }
              ],
              keyInsight: "Max-heap of size k (negate distances). Farthest gets evicted. Remaining k are closest.",
              code: `import heapq

class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        heap = []
        for x, y in points:
            dist = -(x * x + y * y)
            heapq.heappush(heap, (dist, x, y))
            if len(heap) > k:
                heapq.heappop(heap)
        return [[x, y] for _, x, y in heap]`
            }
          ]
        }
      ]
    },
    {
      id: "phase-3",
      name: "Backtracking + Graphs",
      week: 3,
      description: "Recursion, backtracking, and graph traversals",
      days: [
        {
          day: 15,
          pattern: "Recursion",
          problems: [
            {
              id: "fibonacci",
              name: "Fibonacci Number",
              difficulty: "Easy",
              lcNumber: 509,
              leetcodeUrl: "https://leetcode.com/problems/fibonacci-number/",
              pattern: "Simple Recursion / DP",
              signals: ["fibonacci", "F(n) = F(n-1) + F(n-2)"],
              intuition: [
                { q: "What are the base cases?", a: "F(0) = 0, F(1) = 1" },
                { q: "Why is naive recursion slow?", a: "Exponential — recalculates same subproblems" },
                { q: "How to optimize?", a: "Bottom-up with two variables: prev and curr" }
              ],
              keyInsight: "Use bottom-up iteration with two variables instead of recursive calls. O(n) time, O(1) space.",
              code: `class Solution:
    def fib(self, n: int) -> int:
        if n <= 1:
            return n
        prev, curr = 0, 1
        for _ in range(2, n + 1):
            prev, curr = curr, prev + curr
        return curr`
            },
            {
              id: "pow-x-n",
              name: "Pow(x, n)",
              difficulty: "Medium",
              lcNumber: 50,
              leetcodeUrl: "https://leetcode.com/problems/powx-n/",
              pattern: "Fast Exponentiation (Divide & Conquer)",
              signals: ["implement pow(x, n)"],
              intuition: [
                { q: "Why not multiply x, n times?", a: "O(n) is too slow for large n" },
                { q: "How to make it O(log n)?", a: "x^n = (x^(n/2))^2. Halve n each step." },
                { q: "What about negative n?", a: "x^(-n) = 1 / x^n" }
              ],
              keyInsight: "Square the result and halve the exponent. Handle negative n by inverting x.",
              code: `class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x = 1 / x
            n = -n
        result = 1
        while n > 0:
            if n % 2 == 1:
                result *= x
            x *= x
            n //= 2
        return result`
            },
            {
              id: "climbing-stairs-recursion",
              name: "Climbing Stairs",
              difficulty: "Easy",
              lcNumber: 70,
              leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
              pattern: "Fibonacci Variant",
              signals: ["how many distinct ways", "1 or 2 steps"],
              intuition: [
                { q: "Why is this Fibonacci?", a: "ways(n) = ways(n-1) + ways(n-2)" },
                { q: "Base cases?", a: "ways(1) = 1, ways(2) = 2" },
                { q: "Best approach?", a: "Bottom-up with two variables" }
              ],
              keyInsight: "Same as Fibonacci. At each step: take 1 step (from n-1) or 2 steps (from n-2).",
              code: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        prev, curr = 1, 2
        for _ in range(3, n + 1):
            prev, curr = curr, prev + curr
        return curr`
            }
          ]
        },
        {
          day: 16,
          pattern: "Backtracking",
          problems: [
            {
              id: "subsets",
              name: "Subsets",
              difficulty: "Medium",
              lcNumber: 78,
              leetcodeUrl: "https://leetcode.com/problems/subsets/",
              pattern: "Include/Exclude Backtracking",
              signals: ["return all possible subsets", "power set"],
              intuition: [
                { q: "What choice at each element?", a: "Include it or exclude it" },
                { q: "When do you add to result?", a: "At every node (every subset is valid)" },
                { q: "How to avoid duplicates?", a: "Only consider elements after current index" }
              ],
              keyInsight: "For each element: include or exclude. Recurse with index+1. Every path is a valid subset.",
              code: `class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        result = []

        def backtrack(start, current):
            result.append(current[:])
            for i in range(start, len(nums)):
                current.append(nums[i])
                backtrack(i + 1, current)
                current.pop()

        backtrack(0, [])
        return result`
            },
            {
              id: "combinations",
              name: "Combinations",
              difficulty: "Medium",
              lcNumber: 77,
              leetcodeUrl: "https://leetcode.com/problems/combinations/",
              pattern: "Fixed-Size Backtracking",
              signals: ["all possible combinations of k numbers"],
              intuition: [
                { q: "How is this different from subsets?", a: "Only collect subsets of exactly size k" },
                { q: "When do you add to result?", a: "Only when len(current) == k" },
                { q: "Pruning?", a: "If remaining elements can't fill k slots, stop early" }
              ],
              keyInsight: "Same as subsets, but only add to result when current has exactly k elements.",
              code: `class Solution:
    def combine(self, n: int, k: int) -> list[list[int]]:
        result = []

        def backtrack(start, current):
            if len(current) == k:
                result.append(current[:])
                return
            for i in range(start, n + 1):
                current.append(i)
                backtrack(i + 1, current)
                current.pop()

        backtrack(1, [])
        return result`
            },
            {
              id: "permutations",
              name: "Permutations",
              difficulty: "Medium",
              lcNumber: 46,
              leetcodeUrl: "https://leetcode.com/problems/permutations/",
              pattern: "Used-Set Backtracking",
              signals: ["return all possible permutations"],
              intuition: [
                { q: "How is this different from subsets?", a: "Order matters. [1,2] != [2,1]" },
                { q: "Can you reuse elements?", a: "No — track used elements" },
                { q: "When do you add to result?", a: "When permutation length == nums length" }
              ],
              keyInsight: "At each position, try every unused element. Use a set to track what's been used.",
              code: `class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        result = []

        def backtrack(current):
            if len(current) == len(nums):
                result.append(current[:])
                return
            for num in nums:
                if num not in current:
                    current.append(num)
                    backtrack(current)
                    current.pop()

        backtrack([])
        return result`
            }
          ]
        },
        {
          day: 17,
          pattern: "Graph DFS",
          problems: [
            {
              id: "number-of-islands",
              name: "Number of Islands",
              difficulty: "Medium",
              lcNumber: 200,
              leetcodeUrl: "https://leetcode.com/problems/number-of-islands/",
              pattern: "Grid DFS — Connected Components",
              signals: ["number of islands", "grid of 1s and 0s"],
              intuition: [
                { q: "What defines an island?", a: "A group of connected '1's (horizontal/vertical)" },
                { q: "How to avoid counting the same island twice?", a: "Mark visited cells (set to '0' or use visited set)" },
                { q: "When do you increment count?", a: "Each time you find an unvisited '1'" }
              ],
              keyInsight: "Scan grid. When you find a '1', increment count and DFS to mark all connected '1's as visited.",
              code: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid:
            return 0
        count = 0
        rows, cols = len(grid), len(grid[0])

        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols:
                return
            if grid[r][c] != '1':
                return
            grid[r][c] = '0'
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == '1':
                    count += 1
                    dfs(r, c)
        return count`
            },
            {
              id: "clone-graph",
              name: "Clone Graph",
              difficulty: "Medium",
              lcNumber: 133,
              leetcodeUrl: "https://leetcode.com/problems/clone-graph/",
              pattern: "DFS with HashMap Cloning",
              signals: ["return a deep copy", "clone graph"],
              intuition: [
                { q: "Why do you need a hashmap?", a: "To map old nodes → new clones (avoid duplicates)" },
                { q: "When do you create a clone?", a: "First time visiting a node" },
                { q: "How do you handle neighbors?", a: "Recursively clone each neighbor, add to clone's list" }
              ],
              keyInsight: "DFS with a map of old→new. Clone node, recurse on neighbors. Map prevents infinite loops.",
              code: `class Solution:
    def cloneGraph(self, node):
        if not node:
            return None
        clones = {}

        def dfs(node):
            if node in clones:
                return clones[node]
            clone = Node(node.val)
            clones[node] = clone
            for neighbor in node.neighbors:
                clone.neighbors.append(dfs(neighbor))
            return clone

        return dfs(node)`
            },
            {
              id: "max-area-island",
              name: "Max Area of Island",
              difficulty: "Medium",
              lcNumber: 695,
              leetcodeUrl: "https://leetcode.com/problems/max-area-of-island/",
              pattern: "Grid DFS — Count Cells",
              signals: ["maximum area of an island"],
              intuition: [
                { q: "How is this different from Number of Islands?", a: "Instead of counting islands, count cells per island" },
                { q: "What does DFS return?", a: "The area (count of connected 1s)" },
                { q: "How to track max?", a: "Compare each island's area with global max" }
              ],
              keyInsight: "Same as Number of Islands, but DFS returns area. Track global maximum area.",
              code: `class Solution:
    def maxAreaOfIsland(self, grid: list[list[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        max_area = 0

        def dfs(r, c):
            if r < 0 or r >= rows or c < 0 or c >= cols:
                return 0
            if grid[r][c] != 1:
                return 0
            grid[r][c] = 0
            return 1 + dfs(r+1, c) + dfs(r-1, c) + dfs(r, c+1) + dfs(r, c-1)

        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 1:
                    max_area = max(max_area, dfs(r, c))
        return max_area`
            }
          ]
        },
        {
          day: 18,
          pattern: "Graph BFS",
          problems: [
            {
              id: "rotting-oranges",
              name: "Rotting Oranges",
              difficulty: "Medium",
              lcNumber: 994,
              leetcodeUrl: "https://leetcode.com/problems/rotting-oranges/",
              pattern: "Multi-Source BFS",
              signals: ["rotting oranges", "minimum number of minutes"],
              intuition: [
                { q: "Why BFS, not DFS?", a: "BFS processes level by level = minute by minute" },
                { q: "Why multi-source?", a: "All rotten oranges spread simultaneously" },
                { q: "When is it impossible?", a: "If fresh oranges remain after BFS finishes" }
              ],
              keyInsight: "Add all rotten oranges to queue at once. BFS level = 1 minute. Check if fresh remain at end.",
              code: `from collections import deque

class Solution:
    def orangesRotting(self, grid: list[list[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        queue = deque()
        fresh = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] == 2:
                    queue.append((r, c))
                elif grid[r][c] == 1:
                    fresh += 1
        if fresh == 0:
            return 0
        minutes = 0
        directions = [(1,0), (-1,0), (0,1), (0,-1)]
        while queue:
            for _ in range(len(queue)):
                r, c = queue.popleft()
                for dr, dc in directions:
                    nr, nc = r + dr, c + dc
                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:
                        grid[nr][nc] = 2
                        fresh -= 1
                        queue.append((nr, nc))
            minutes += 1
        return minutes - 1 if fresh == 0 else -1`
            },
            {
              id: "walls-and-gates",
              name: "Walls and Gates",
              difficulty: "Medium",
              lcNumber: 286,
              leetcodeUrl: "https://leetcode.com/problems/walls-and-gates/",
              pattern: "Multi-Source BFS from Gates",
              signals: ["fill each empty room with distance to nearest gate"],
              intuition: [
                { q: "Why start from gates, not rooms?", a: "Multi-source BFS from all gates finds shortest distance naturally" },
                { q: "What's the initial queue?", a: "All gate positions (cells with value 0)" },
                { q: "How do you update distances?", a: "Each BFS level = distance + 1" }
              ],
              keyInsight: "Start BFS from all gates simultaneously. Each level increases distance by 1. First visit = shortest.",
              code: `from collections import deque

class Solution:
    def wallsAndGates(self, rooms: list[list[int]]) -> None:
        if not rooms:
            return
        rows, cols = len(rooms), len(rooms[0])
        INF = 2147483647
        queue = deque()
        for r in range(rows):
            for c in range(cols):
                if rooms[r][c] == 0:
                    queue.append((r, c))
        directions = [(1,0), (-1,0), (0,1), (0,-1)]
        while queue:
            r, c = queue.popleft()
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and rooms[nr][nc] == INF:
                    rooms[nr][nc] = rooms[r][c] + 1
                    queue.append((nr, nc))`
            }
          ]
        },
        {
          day: 19,
          pattern: "Topological Sort",
          problems: [
            {
              id: "course-schedule",
              name: "Course Schedule",
              difficulty: "Medium",
              lcNumber: 207,
              leetcodeUrl: "https://leetcode.com/problems/course-schedule/",
              pattern: "Cycle Detection via DFS",
              signals: ["prerequisites", "possible to finish all courses"],
              intuition: [
                { q: "What does a cycle mean?", a: "Impossible to finish — circular dependency" },
                { q: "How to detect cycle in DFS?", a: "Three states: unvisited, in-progress, completed" },
                { q: "When is there a cycle?", a: "If you visit a node that's in-progress (still on current path)" }
              ],
              keyInsight: "Build adjacency list. DFS with 3 states. Cycle = revisiting in-progress node.",
              code: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        graph = {i: [] for i in range(numCourses)}
        for course, prereq in prerequisites:
            graph[course].append(prereq)
        visited = set()
        in_progress = set()

        def dfs(course):
            if course in in_progress:
                return False
            if course in visited:
                return True
            in_progress.add(course)
            for prereq in graph[course]:
                if not dfs(prereq):
                    return False
            in_progress.remove(course)
            visited.add(course)
            return True

        for course in range(numCourses):
            if not dfs(course):
                return False
        return True`
            },
            {
              id: "course-schedule-ii",
              name: "Course Schedule II",
              difficulty: "Medium",
              lcNumber: 210,
              leetcodeUrl: "https://leetcode.com/problems/course-schedule-ii/",
              pattern: "Topological Sort — Kahn's BFS",
              signals: ["return the ordering of courses", "topological order"],
              intuition: [
                { q: "What's Kahn's algorithm?", a: "BFS starting from nodes with 0 in-degree" },
                { q: "What does in-degree mean?", a: "Number of prerequisites pointing to this course" },
                { q: "When is ordering impossible?", a: "If result length != numCourses (cycle exists)" }
              ],
              keyInsight: "Compute in-degrees. Start BFS from 0-degree nodes. Process = add to order, reduce neighbors' degrees.",
              code: `from collections import deque

class Solution:
    def findOrder(self, numCourses: int, prerequisites: list[list[int]]) -> list[int]:
        graph = {i: [] for i in range(numCourses)}
        in_degree = [0] * numCourses
        for course, prereq in prerequisites:
            graph[prereq].append(course)
            in_degree[course] += 1
        queue = deque()
        for i in range(numCourses):
            if in_degree[i] == 0:
                queue.append(i)
        order = []
        while queue:
            course = queue.popleft()
            order.append(course)
            for neighbor in graph[course]:
                in_degree[neighbor] -= 1
                if in_degree[neighbor] == 0:
                    queue.append(neighbor)
        return order if len(order) == numCourses else []`
            }
          ]
        },
        {
          day: 20,
          pattern: "Union Find",
          problems: [
            {
              id: "connected-components",
              name: "Number of Connected Components",
              difficulty: "Medium",
              lcNumber: 323,
              leetcodeUrl: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
              pattern: "Union-Find",
              signals: ["number of connected components", "undirected graph"],
              intuition: [
                { q: "What does union-find track?", a: "Which nodes belong to the same component" },
                { q: "What's the find operation?", a: "Find the root/representative of a node's component" },
                { q: "What's the union operation?", a: "Merge two components by connecting their roots" }
              ],
              keyInsight: "Start with n components. Each union merges two. Count remaining components.",
              code: `class Solution:
    def countComponents(self, n: int, edges: list[list[int]]) -> int:
        parent = list(range(n))
        rank = [0] * n

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        def union(x, y):
            px, py = find(x), find(y)
            if px == py:
                return False
            if rank[px] < rank[py]:
                px, py = py, px
            parent[py] = px
            if rank[px] == rank[py]:
                rank[px] += 1
            return True

        components = n
        for a, b in edges:
            if union(a, b):
                components -= 1
        return components`
            },
            {
              id: "redundant-connection",
              name: "Redundant Connection",
              difficulty: "Medium",
              lcNumber: 684,
              leetcodeUrl: "https://leetcode.com/problems/redundant-connection/",
              pattern: "Union-Find — Cycle Detection",
              signals: ["redundant connection", "return the edge that causes cycle"],
              intuition: [
                { q: "When does adding an edge create a cycle?", a: "When both nodes are already in the same component" },
                { q: "How to detect this?", a: "find(a) == find(b) before union → cycle!" },
                { q: "Which edge to return?", a: "The last edge that would create a cycle" }
              ],
              keyInsight: "Process edges in order. If union returns False (same component), that edge is redundant.",
              code: `class Solution:
    def findRedundantConnection(self, edges: list[list[int]]) -> list[int]:
        n = len(edges)
        parent = list(range(n + 1))
        rank = [0] * (n + 1)

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        def union(x, y):
            px, py = find(x), find(y)
            if px == py:
                return False
            if rank[px] < rank[py]:
                px, py = py, px
            parent[py] = px
            if rank[px] == rank[py]:
                rank[px] += 1
            return True

        for a, b in edges:
            if not union(a, b):
                return [a, b]`
            }
          ]
        }
      ]
    },
    {
      id: "phase-4",
      name: "Dynamic Programming",
      week: 4,
      description: "Overlapping subproblems, optimal substructure, and greedy strategies",
      days: [
        {
          day: 22,
          pattern: "1D DP",
          problems: [
            {
              id: "climbing-stairs-dp",
              name: "Climbing Stairs",
              difficulty: "Easy",
              lcNumber: 70,
              leetcodeUrl: "https://leetcode.com/problems/climbing-stairs/",
              pattern: "Fibonacci DP",
              signals: ["how many distinct ways", "1 or 2 steps"],
              intuition: [
                { q: "Recurrence?", a: "dp[i] = dp[i-1] + dp[i-2]" },
                { q: "Base cases?", a: "dp[1] = 1, dp[2] = 2" },
                { q: "Space optimization?", a: "Only need last two values" }
              ],
              keyInsight: "Fibonacci pattern. Ways to reach step n = ways from (n-1) + ways from (n-2).",
              code: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        prev, curr = 1, 2
        for _ in range(3, n + 1):
            prev, curr = curr, prev + curr
        return curr`
            },
            {
              id: "house-robber",
              name: "House Robber",
              difficulty: "Medium",
              lcNumber: 198,
              leetcodeUrl: "https://leetcode.com/problems/house-robber/",
              pattern: "Decision DP — Rob or Skip",
              signals: ["cannot rob adjacent houses", "maximum amount"],
              intuition: [
                { q: "What's the choice at each house?", a: "Rob it (skip previous) or skip it (keep previous best)" },
                { q: "Recurrence?", a: "dp[i] = max(dp[i-1], dp[i-2] + nums[i])" },
                { q: "Space optimization?", a: "Two variables: prev1 (i-1) and prev2 (i-2)" }
              ],
              keyInsight: "At each house: max of (skip this house, rob this house + best from 2 ago).",
              code: `class Solution:
    def rob(self, nums: list[int]) -> int:
        if len(nums) <= 2:
            return max(nums)
        prev2, prev1 = nums[0], max(nums[0], nums[1])
        for i in range(2, len(nums)):
            prev2, prev1 = prev1, max(prev1, prev2 + nums[i])
        return prev1`
            },
            {
              id: "min-cost-climbing",
              name: "Min Cost Climbing Stairs",
              difficulty: "Easy",
              lcNumber: 746,
              leetcodeUrl: "https://leetcode.com/problems/min-cost-climbing-stairs/",
              pattern: "1D DP — Min Path",
              signals: ["minimum cost to reach the top", "1 or 2 steps"],
              intuition: [
                { q: "What's the cost to reach step i?", a: "min(cost from i-1, cost from i-2) + cost[i]" },
                { q: "Where do you start?", a: "Step 0 or step 1 (both are free starting points)" },
                { q: "Where is 'the top'?", a: "Past the last step — index len(cost)" }
              ],
              keyInsight: "dp[i] = cost[i] + min(dp[i-1], dp[i-2]). Answer is min(dp[-1], dp[-2]).",
              code: `class Solution:
    def minCostClimbingStairs(self, cost: list[int]) -> int:
        prev2, prev1 = cost[0], cost[1]
        for i in range(2, len(cost)):
            prev2, prev1 = prev1, cost[i] + min(prev1, prev2)
        return min(prev1, prev2)`
            }
          ]
        },
        {
          day: 23,
          pattern: "Decision DP",
          problems: [
            {
              id: "house-robber-ii",
              name: "House Robber II",
              difficulty: "Medium",
              lcNumber: 213,
              leetcodeUrl: "https://leetcode.com/problems/house-robber-ii/",
              pattern: "Circular DP",
              signals: ["houses arranged in a circle", "cannot rob adjacent"],
              intuition: [
                { q: "What's different from House Robber I?", a: "First and last houses are adjacent (circular)" },
                { q: "How to handle the circle?", a: "Run House Robber twice: once without first, once without last" },
                { q: "Answer?", a: "max of the two runs" }
              ],
              keyInsight: "Break the circle: solve for nums[0:n-1] and nums[1:n]. Take the max.",
              code: `class Solution:
    def rob(self, nums: list[int]) -> int:
        if len(nums) <= 2:
            return max(nums)

        def rob_linear(houses):
            prev2, prev1 = 0, 0
            for h in houses:
                prev2, prev1 = prev1, max(prev1, prev2 + h)
            return prev1

        return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))`
            },
            {
              id: "delete-and-earn",
              name: "Delete and Earn",
              difficulty: "Medium",
              lcNumber: 740,
              leetcodeUrl: "https://leetcode.com/problems/delete-and-earn/",
              pattern: "House Robber on Frequencies",
              signals: ["delete and earn points", "delete all elements equal to nums[i]-1 and nums[i]+1"],
              intuition: [
                { q: "Why is this like House Robber?", a: "Taking value v means you can't take v-1 or v+1 (adjacent values)" },
                { q: "How to transform the problem?", a: "Create array where index = value, entry = total points for that value" },
                { q: "Then what?", a: "Run House Robber on that array" }
              ],
              keyInsight: "Transform into House Robber: earn[v] = v * count(v). Then rob or skip each consecutive value.",
              code: `from collections import Counter

class Solution:
    def deleteAndEarn(self, nums: list[int]) -> int:
        count = Counter(nums)
        max_val = max(nums)
        earn = [0] * (max_val + 1)
        for num in count:
            earn[num] = num * count[num]
        prev2, prev1 = 0, 0
        for i in range(len(earn)):
            prev2, prev1 = prev1, max(prev1, prev2 + earn[i])
        return prev1`
            }
          ]
        },
        {
          day: 24,
          pattern: "Knapsack DP",
          problems: [
            {
              id: "coin-change",
              name: "Coin Change",
              difficulty: "Medium",
              lcNumber: 322,
              leetcodeUrl: "https://leetcode.com/problems/coin-change/",
              pattern: "Unbounded Knapsack — Min Coins",
              signals: ["fewest number of coins", "make up that amount"],
              intuition: [
                { q: "What does dp[i] represent?", a: "Minimum coins to make amount i" },
                { q: "Recurrence?", a: "dp[i] = min(dp[i], dp[i - coin] + 1) for each coin" },
                { q: "Base case?", a: "dp[0] = 0 (zero coins for amount 0)" }
              ],
              keyInsight: "For each amount, try every coin. dp[amount] = 1 + dp[amount - coin]. Take minimum.",
              code: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if coin <= i:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return dp[amount] if dp[amount] != float('inf') else -1`
            },
            {
              id: "target-sum",
              name: "Target Sum",
              difficulty: "Medium",
              lcNumber: 494,
              leetcodeUrl: "https://leetcode.com/problems/target-sum/",
              pattern: "DP — Count Ways",
              signals: ["assign + or - to each number", "number of ways to reach target"],
              intuition: [
                { q: "What's the brute force?", a: "Try + and - for each number: 2^n combinations" },
                { q: "How to use DP?", a: "dp[sum] = number of ways to achieve that sum" },
                { q: "At each number, what do you do?", a: "For each existing sum s: add to s+num and s-num" }
              ],
              keyInsight: "Use a dictionary dp[sum] = count. For each number, create new sums by adding and subtracting.",
              code: `from collections import defaultdict

class Solution:
    def findTargetSumWays(self, nums: list[int], target: int) -> int:
        dp = defaultdict(int)
        dp[0] = 1
        for num in nums:
            next_dp = defaultdict(int)
            for s, count in dp.items():
                next_dp[s + num] += count
                next_dp[s - num] += count
            dp = next_dp
        return dp[target]`
            },
            {
              id: "partition-equal-subset",
              name: "Partition Equal Subset Sum",
              difficulty: "Medium",
              lcNumber: 416,
              leetcodeUrl: "https://leetcode.com/problems/partition-equal-subset-sum/",
              pattern: "0/1 Knapsack — Subset Sum",
              signals: ["partition into two subsets with equal sum"],
              intuition: [
                { q: "What's the target?", a: "total_sum / 2 (if odd, impossible)" },
                { q: "How is this a knapsack?", a: "Can we select a subset that sums to target?" },
                { q: "What does dp[j] mean?", a: "Can we form sum j using elements seen so far?" }
              ],
              keyInsight: "If total sum is odd, return False. Otherwise, find if subset sums to total/2. 0/1 knapsack.",
              code: `class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2 != 0:
            return False
        target = total // 2
        dp = set([0])
        for num in nums:
            next_dp = set()
            for s in dp:
                next_dp.add(s)
                next_dp.add(s + num)
            dp = next_dp
        return target in dp`
            }
          ]
        },
        {
          day: 25,
          pattern: "2D DP",
          problems: [
            {
              id: "unique-paths",
              name: "Unique Paths",
              difficulty: "Medium",
              lcNumber: 62,
              leetcodeUrl: "https://leetcode.com/problems/unique-paths/",
              pattern: "Grid DP",
              signals: ["how many possible unique paths", "can only move right or down"],
              intuition: [
                { q: "Recurrence?", a: "dp[r][c] = dp[r-1][c] + dp[r][c-1]" },
                { q: "Base case?", a: "First row and first column are all 1 (only one way)" },
                { q: "Space optimization?", a: "Can use 1D array (previous row)" }
              ],
              keyInsight: "Each cell = sum of cell above + cell to the left. Both ways to arrive at this cell.",
              code: `class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        dp = [1] * n
        for _ in range(1, m):
            for j in range(1, n):
                dp[j] += dp[j - 1]
        return dp[n - 1]`
            },
            {
              id: "longest-common-subsequence",
              name: "Longest Common Subsequence",
              difficulty: "Medium",
              lcNumber: 1143,
              leetcodeUrl: "https://leetcode.com/problems/longest-common-subsequence/",
              pattern: "Classic 2D DP",
              signals: ["longest common subsequence", "two strings"],
              intuition: [
                { q: "If chars match, what happens?", a: "dp[i][j] = dp[i-1][j-1] + 1" },
                { q: "If chars don't match?", a: "dp[i][j] = max(dp[i-1][j], dp[i][j-1])" },
                { q: "What does dp[i][j] represent?", a: "LCS length of text1[:i] and text2[:j]" }
              ],
              keyInsight: "Match → diagonal + 1. No match → max of skipping either character.",
              code: `class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[m][n]`
            }
          ]
        },
        {
          day: 26,
          pattern: "State Machine DP",
          problems: [
            {
              id: "buy-sell-cooldown",
              name: "Best Time to Buy/Sell Stock with Cooldown",
              difficulty: "Medium",
              lcNumber: 309,
              leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
              pattern: "State Machine DP",
              signals: ["buy and sell with cooldown", "multiple transactions"],
              intuition: [
                { q: "What are the states?", a: "held (holding stock), sold (just sold), rest (cooldown done)" },
                { q: "Transitions?", a: "held: keep or buy. sold: must rest next. rest: buy or keep resting." },
                { q: "Answer?", a: "max(sold, rest) on last day" }
              ],
              keyInsight: "Three states: held, sold, rest. Track max profit in each state. Transition daily.",
              code: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        if not prices:
            return 0
        held = -prices[0]
        sold = 0
        rest = 0
        for price in prices[1:]:
            new_held = max(held, rest - price)
            new_sold = held + price
            new_rest = max(rest, sold)
            held, sold, rest = new_held, new_sold, new_rest
        return max(sold, rest)`
            },
            {
              id: "buy-sell-k-transactions",
              name: "Best Time to Buy/Sell Stock IV",
              difficulty: "Hard",
              lcNumber: 188,
              leetcodeUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
              pattern: "DP with K Transactions",
              signals: ["at most k transactions", "maximum profit"],
              intuition: [
                { q: "What does dp[t][i] represent?", a: "Max profit using at most t transactions up to day i" },
                { q: "If k >= n/2?", a: "Unlimited transactions — just sum all profits" },
                { q: "Recurrence?", a: "For each transaction, track best buy and best profit" }
              ],
              keyInsight: "For each of k transactions, track the best time to buy (max profit if bought today or before).",
              code: `class Solution:
    def maxProfit(self, k: int, prices: list[int]) -> int:
        if not prices:
            return 0
        n = len(prices)
        if k >= n // 2:
            return sum(max(0, prices[i+1] - prices[i]) for i in range(n-1))
        buy = [float('-inf')] * (k + 1)
        sell = [0] * (k + 1)
        for price in prices:
            for t in range(1, k + 1):
                buy[t] = max(buy[t], sell[t-1] - price)
                sell[t] = max(sell[t], buy[t] + price)
        return sell[k]`
            }
          ]
        },
        {
          day: 27,
          pattern: "Greedy",
          problems: [
            {
              id: "jump-game",
              name: "Jump Game",
              difficulty: "Medium",
              lcNumber: 55,
              leetcodeUrl: "https://leetcode.com/problems/jump-game/",
              pattern: "Greedy — Farthest Reach",
              signals: ["can you reach the last index", "maximum jump length"],
              intuition: [
                { q: "What do you track?", a: "The farthest index reachable so far" },
                { q: "When can't you proceed?", a: "If current index > farthest reachable" },
                { q: "When do you succeed?", a: "If farthest reachable >= last index" }
              ],
              keyInsight: "Track max reachable index. At each position, update max reach. If stuck, return False.",
              code: `class Solution:
    def canJump(self, nums: list[int]) -> bool:
        max_reach = 0
        for i in range(len(nums)):
            if i > max_reach:
                return False
            max_reach = max(max_reach, i + nums[i])
        return True`
            },
            {
              id: "gas-station",
              name: "Gas Station",
              difficulty: "Medium",
              lcNumber: 134,
              leetcodeUrl: "https://leetcode.com/problems/gas-station/",
              pattern: "Greedy — Reset Start",
              signals: ["circular route", "gas stations", "unique solution"],
              intuition: [
                { q: "When is a solution impossible?", a: "If total gas < total cost" },
                { q: "How to find the start?", a: "If tank goes negative at i, start from i+1" },
                { q: "Why does resetting work?", a: "If you can't reach i+1 starting from s, no station between s and i works either" }
              ],
              keyInsight: "If total gas >= total cost, solution exists. Track current tank; if negative, reset start to next station.",
              code: `class Solution:
    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
        if sum(gas) < sum(cost):
            return -1
        tank = 0
        start = 0
        for i in range(len(gas)):
            tank += gas[i] - cost[i]
            if tank < 0:
                start = i + 1
                tank = 0
        return start`
            },
            {
              id: "partition-labels",
              name: "Partition Labels",
              difficulty: "Medium",
              lcNumber: 763,
              leetcodeUrl: "https://leetcode.com/problems/partition-labels/",
              pattern: "Greedy — Last Occurrence",
              signals: ["partition the string", "each letter appears in at most one part"],
              intuition: [
                { q: "What determines a partition boundary?", a: "All characters in the partition must have their last occurrence within it" },
                { q: "What do you precompute?", a: "Last index of each character" },
                { q: "How to find partition end?", a: "Track the farthest last-occurrence of any char seen so far" }
              ],
              keyInsight: "Precompute last occurrence of each char. Extend partition end to include all chars' last occurrences.",
              code: `class Solution:
    def partitionLabels(self, s: str) -> list[int]:
        last = {c: i for i, c in enumerate(s)}
        result = []
        start = 0
        end = 0
        for i, c in enumerate(s):
            end = max(end, last[c])
            if i == end:
                result.append(end - start + 1)
                start = end + 1
        return result`
            }
          ]
        }
      ]
    },
    {
      id: "phase-5",
      name: "Advanced Patterns",
      week: 5,
      description: "Monotonic stack, intervals, tries, bit manipulation, and more",
      days: [
        {
          day: 29,
          pattern: "Monotonic Stack",
          problems: [
            {
              id: "daily-temperatures",
              name: "Daily Temperatures",
              difficulty: "Medium",
              lcNumber: 739,
              leetcodeUrl: "https://leetcode.com/problems/daily-temperatures/",
              pattern: "Monotonic Decreasing Stack",
              signals: ["how many days until warmer", "next greater temperature"],
              intuition: [
                { q: "What does the stack store?", a: "Indices of temperatures (not the values)" },
                { q: "When do you pop?", a: "When current temp > temp at stack top" },
                { q: "What do you record on pop?", a: "result[popped_index] = current_index - popped_index" }
              ],
              keyInsight: "Stack of indices, decreasing temps. When a warmer day comes, pop and record the gap.",
              code: `class Solution:
    def dailyTemperatures(self, temperatures: list[int]) -> list[int]:
        n = len(temperatures)
        result = [0] * n
        stack = []
        for i in range(n):
            while stack and temperatures[i] > temperatures[stack[-1]]:
                prev = stack.pop()
                result[prev] = i - prev
            stack.append(i)
        return result`
            },
            {
              id: "next-greater-element",
              name: "Next Greater Element I",
              difficulty: "Easy",
              lcNumber: 496,
              leetcodeUrl: "https://leetcode.com/problems/next-greater-element-i/",
              pattern: "Monotonic Stack + HashMap",
              signals: ["next greater element", "subset of another array"],
              intuition: [
                { q: "How to find next greater for all elements?", a: "Monotonic stack on nums2, store results in hashmap" },
                { q: "What does the stack maintain?", a: "Decreasing sequence — waiting for their next greater" },
                { q: "How to answer queries for nums1?", a: "Look up each element in the hashmap" }
              ],
              keyInsight: "Process nums2 with monotonic stack → build map of next greater. Look up nums1 elements.",
              code: `class Solution:
    def nextGreaterElement(self, nums1: list[int], nums2: list[int]) -> list[int]:
        next_greater = {}
        stack = []
        for num in nums2:
            while stack and num > stack[-1]:
                next_greater[stack.pop()] = num
            stack.append(num)
        return [next_greater.get(num, -1) for num in nums1]`
            }
          ]
        },
        {
          day: 30,
          pattern: "Intervals",
          problems: [
            {
              id: "merge-intervals",
              name: "Merge Intervals",
              difficulty: "Medium",
              lcNumber: 56,
              leetcodeUrl: "https://leetcode.com/problems/merge-intervals/",
              pattern: "Sort + Merge",
              signals: ["merge overlapping intervals"],
              intuition: [
                { q: "First step?", a: "Sort by start time" },
                { q: "When do two intervals overlap?", a: "current.start <= previous.end" },
                { q: "How to merge?", a: "Extend end to max(prev.end, curr.end)" }
              ],
              keyInsight: "Sort by start. If current overlaps with last merged, extend end. Otherwise, add new interval.",
              code: `class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        intervals.sort()
        merged = [intervals[0]]
        for start, end in intervals[1:]:
            if start <= merged[-1][1]:
                merged[-1][1] = max(merged[-1][1], end)
            else:
                merged.append([start, end])
        return merged`
            },
            {
              id: "insert-interval",
              name: "Insert Interval",
              difficulty: "Medium",
              lcNumber: 57,
              leetcodeUrl: "https://leetcode.com/problems/insert-interval/",
              pattern: "Three-Phase Merge",
              signals: ["insert new interval", "merge if necessary"],
              intuition: [
                { q: "What are the three phases?", a: "Before overlap, during overlap (merge), after overlap" },
                { q: "When does overlap start?", a: "When interval.start <= newInterval.end" },
                { q: "When does overlap end?", a: "When interval.start > newInterval.end" }
              ],
              keyInsight: "Add all intervals before new one. Merge all overlapping. Add all after. Three clean phases.",
              code: `class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        result = []
        for i, interval in enumerate(intervals):
            if interval[1] < newInterval[0]:
                result.append(interval)
            elif interval[0] > newInterval[1]:
                result.append(newInterval)
                return result + intervals[i:]
            else:
                newInterval = [
                    min(interval[0], newInterval[0]),
                    max(interval[1], newInterval[1])
                ]
        result.append(newInterval)
        return result`
            }
          ]
        },
        {
          day: 31,
          pattern: "Trie",
          problems: [
            {
              id: "implement-trie",
              name: "Implement Trie (Prefix Tree)",
              difficulty: "Medium",
              lcNumber: 208,
              leetcodeUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/",
              pattern: "Trie Data Structure",
              signals: ["implement a trie", "insert, search, startsWith"],
              intuition: [
                { q: "What's a trie node?", a: "A dictionary of children + is_end flag" },
                { q: "How does insert work?", a: "Walk/create nodes for each character, mark end" },
                { q: "Difference between search and startsWith?", a: "search checks is_end, startsWith doesn't" }
              ],
              keyInsight: "Each node has children dict and end-of-word flag. Insert creates path. Search follows path.",
              code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def search(self, word: str) -> bool:
        node = self.root
        for char in word:
            if char not in node.children:
                return False
            node = node.children[char]
        return node.is_end

    def startsWith(self, prefix: str) -> bool:
        node = self.root
        for char in prefix:
            if char not in node.children:
                return False
            node = node.children[char]
        return True`
            },
            {
              id: "word-search-ii",
              name: "Word Search II",
              difficulty: "Hard",
              lcNumber: 212,
              leetcodeUrl: "https://leetcode.com/problems/word-search-ii/",
              pattern: "Trie + DFS Backtracking",
              signals: ["find all words in the board", "given a list of words"],
              intuition: [
                { q: "Why trie instead of searching word by word?", a: "Trie lets you search all words simultaneously" },
                { q: "How does DFS + Trie work?", a: "DFS on board, walk trie in parallel. If trie node is end → found word." },
                { q: "How to avoid duplicates?", a: "Remove word from trie after finding it" }
              ],
              keyInsight: "Build trie from words. DFS on board while walking trie. Prune branches with no children.",
              code: `class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        root = {}
        for word in words:
            node = root
            for c in word:
                node = node.setdefault(c, {})
            node['#'] = word

        rows, cols = len(board), len(board[0])
        result = []

        def dfs(r, c, node):
            char = board[r][c]
            if char not in node:
                return
            next_node = node[char]
            if '#' in next_node:
                result.append(next_node.pop('#'))
            board[r][c] = '.'
            for dr, dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols and board[nr][nc] != '.':
                    dfs(nr, nc, next_node)
            board[r][c] = char
            if not next_node:
                del node[char]

        for r in range(rows):
            for c in range(cols):
                dfs(r, c, root)
        return result`
            }
          ]
        },
        {
          day: 32,
          pattern: "Bit Manipulation",
          problems: [
            {
              id: "single-number",
              name: "Single Number",
              difficulty: "Easy",
              lcNumber: 136,
              leetcodeUrl: "https://leetcode.com/problems/single-number/",
              pattern: "XOR Cancellation",
              signals: ["every element appears twice except one", "find the single one"],
              intuition: [
                { q: "What property of XOR is key?", a: "a ^ a = 0, and a ^ 0 = a" },
                { q: "What happens when you XOR all elements?", a: "Pairs cancel out, leaving the single number" },
                { q: "Time and space?", a: "O(n) time, O(1) space" }
              ],
              keyInsight: "XOR all numbers together. Duplicates cancel (a^a=0). Result is the unique number.",
              code: `class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        result = 0
        for num in nums:
            result ^= num
        return result`
            },
            {
              id: "number-of-1-bits",
              name: "Number of 1 Bits",
              difficulty: "Easy",
              lcNumber: 191,
              leetcodeUrl: "https://leetcode.com/problems/number-of-1-bits/",
              pattern: "Bit Counting",
              signals: ["number of 1 bits", "Hamming weight"],
              intuition: [
                { q: "What does n & 1 give?", a: "The last bit (0 or 1)" },
                { q: "How to remove the last bit?", a: "n >>= 1 (right shift)" },
                { q: "Faster trick?", a: "n & (n-1) removes the lowest set bit" }
              ],
              keyInsight: "n & (n-1) removes the lowest set bit. Count how many times you can do this.",
              code: `class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            count += 1
            n &= n - 1
        return count`
            },
            {
              id: "reverse-bits",
              name: "Reverse Bits",
              difficulty: "Easy",
              lcNumber: 190,
              leetcodeUrl: "https://leetcode.com/problems/reverse-bits/",
              pattern: "Bit by Bit Construction",
              signals: ["reverse bits of a 32-bit integer"],
              intuition: [
                { q: "How to get the last bit?", a: "n & 1" },
                { q: "How to build the reversed number?", a: "Shift result left, add current last bit" },
                { q: "How many iterations?", a: "Exactly 32 (fixed 32-bit)" }
              ],
              keyInsight: "Extract bits from right of n, build result from left. 32 iterations exactly.",
              code: `class Solution:
    def reverseBits(self, n: int) -> int:
        result = 0
        for _ in range(32):
            result = (result << 1) | (n & 1)
            n >>= 1
        return result`
            }
          ]
        },
        {
          day: 33,
          pattern: "Math Problems",
          problems: [
            {
              id: "happy-number-math",
              name: "Happy Number",
              difficulty: "Easy",
              lcNumber: 202,
              leetcodeUrl: "https://leetcode.com/problems/happy-number/",
              pattern: "Cycle Detection with Set",
              signals: ["happy number", "sum of squares of digits"],
              intuition: [
                { q: "How to detect infinite loop?", a: "Track seen numbers in a set" },
                { q: "When to stop?", a: "When n == 1 (happy) or n is in seen (cycle)" },
                { q: "Alternative?", a: "Floyd's fast/slow pointer (no extra space)" }
              ],
              keyInsight: "Compute digit-square sums. If you see a repeat before reaching 1, it's not happy.",
              code: `class Solution:
    def isHappy(self, n: int) -> bool:
        seen = set()
        while n != 1 and n not in seen:
            seen.add(n)
            total = 0
            while n > 0:
                digit = n % 10
                total += digit * digit
                n //= 10
            n = total
        return n == 1`
            },
            {
              id: "plus-one",
              name: "Plus One",
              difficulty: "Easy",
              lcNumber: 66,
              leetcodeUrl: "https://leetcode.com/problems/plus-one/",
              pattern: "Carry Propagation",
              signals: ["increment large integer represented as array"],
              intuition: [
                { q: "When is it simple?", a: "Last digit < 9: just increment" },
                { q: "When does carry propagate?", a: "When digit is 9 → becomes 0, carry to next" },
                { q: "Edge case?", a: "All 9s → need new digit at front: [1, 0, 0, ...]" }
              ],
              keyInsight: "Walk from right. If digit < 9, increment and return. If 9, set to 0 and continue. If all 9s, prepend 1.",
              code: `class Solution:
    def plusOne(self, digits: list[int]) -> list[int]:
        for i in range(len(digits) - 1, -1, -1):
            if digits[i] < 9:
                digits[i] += 1
                return digits
            digits[i] = 0
        return [1] + digits`
            },
            {
              id: "pow-x-n-math",
              name: "Pow(x, n)",
              difficulty: "Medium",
              lcNumber: 50,
              leetcodeUrl: "https://leetcode.com/problems/powx-n/",
              pattern: "Fast Exponentiation",
              signals: ["implement pow(x, n)"],
              intuition: [
                { q: "Why not loop n times?", a: "O(n) too slow for large n" },
                { q: "Key insight for O(log n)?", a: "x^n = (x^(n/2))^2. Halve exponent each step." },
                { q: "Negative exponent?", a: "x^(-n) = 1/x^n" }
              ],
              keyInsight: "Binary exponentiation: square x and halve n. If n is odd, multiply result by x.",
              code: `class Solution:
    def myPow(self, x: float, n: int) -> float:
        if n < 0:
            x = 1 / x
            n = -n
        result = 1
        while n > 0:
            if n % 2 == 1:
                result *= x
            x *= x
            n //= 2
        return result`
            }
          ]
        },
        {
          day: 34,
          pattern: "K-way Merge",
          problems: [
            {
              id: "merge-k-sorted",
              name: "Merge K Sorted Lists",
              difficulty: "Hard",
              lcNumber: 23,
              leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
              pattern: "Min-Heap Merge",
              signals: ["merge k sorted linked lists"],
              intuition: [
                { q: "Brute force?", a: "Merge two at a time: O(nk)" },
                { q: "Optimal approach?", a: "Min-heap of size k, always pop smallest" },
                { q: "What goes in the heap?", a: "(node.val, index, node) — index breaks ties" }
              ],
              keyInsight: "Push head of each list into min-heap. Pop smallest, add to result, push its next node.",
              code: `import heapq

class Solution:
    def mergeKLists(self, lists):
        heap = []
        for i, node in enumerate(lists):
            if node:
                heapq.heappush(heap, (node.val, i, node))
        dummy = ListNode(0)
        curr = dummy
        while heap:
            val, i, node = heapq.heappop(heap)
            curr.next = node
            curr = curr.next
            if node.next:
                heapq.heappush(heap, (node.next.val, i, node.next))
        return dummy.next`
            },
            {
              id: "find-median-stream",
              name: "Find Median from Data Stream",
              difficulty: "Hard",
              lcNumber: 295,
              leetcodeUrl: "https://leetcode.com/problems/find-median-from-data-stream/",
              pattern: "Two Heaps",
              signals: ["find median", "data stream", "addNum and findMedian"],
              intuition: [
                { q: "Why two heaps?", a: "Max-heap for lower half, min-heap for upper half" },
                { q: "How to maintain balance?", a: "Sizes differ by at most 1" },
                { q: "Where is the median?", a: "Top of max-heap (odd count) or average of both tops (even)" }
              ],
              keyInsight: "Max-heap (lower half) + min-heap (upper half). Keep balanced. Median is at the tops.",
              code: `import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (negate values)
        self.large = []  # min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2`
            }
          ]
        }
      ]
    }
  ]
};

export default problems;
