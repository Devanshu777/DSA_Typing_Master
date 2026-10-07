// Problem statements and concrete examples for all curriculum problems.
// Kept concise to give interview context without requiring a full scroll.

export const problemDescriptions = {
  "two-sum": {
    statement: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
    example: {
      input: "nums = [2, 7, 11, 15], target = 9",
      output: "[0, 1]",
      explanation: "Because nums[0] + nums[1] == 2 + 7 == 9, we return [0, 1]."
    }
  },
  "contains-duplicate": {
    statement: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
    example: {
      input: "nums = [1, 2, 3, 1]",
      output: "true",
      explanation: "The element 1 appears at indices 0 and 3."
    }
  },
  "group-anagrams": {
    statement: "Given an array of strings strs, group the anagrams together in any order. An anagram is a word formed by rearranging the letters of another word.",
    example: {
      input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
      output: '[["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]',
      explanation: "Words with the same sorted character signature are grouped together."
    }
  },
  "top-k-frequent": {
    statement: "Given an integer array nums and an integer k, return the k most frequent elements in the array. You may return the answer in any order.",
    example: {
      input: "nums = [1, 1, 1, 2, 2, 3], k = 2",
      output: "[1, 2]",
      explanation: "1 appears 3 times, 2 appears 2 times, and 3 appears 1 time."
    }
  },
  "valid-palindrome": {
    statement: "A phrase is a palindrome if, after converting all uppercase letters into lowercase and removing all non-alphanumeric characters, it reads the same forward and backward.",
    example: {
      input: 's = "A man, a plan, a canal: Panama"',
      output: "true",
      explanation: '"amanaplanacanalpanama" reads identically in both directions.'
    }
  },
  "two-sum-ii": {
    statement: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return the indices incremented by 1.",
    example: {
      input: "numbers = [2, 7, 11, 15], target = 9",
      output: "[1, 2]",
      explanation: "The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2."
    }
  },
  "3sum": {
    statement: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0 without duplicate triplets.",
    example: {
      input: "nums = [-1, 0, 1, 2, -1, -4]",
      output: "[[-1, -1, 2], [-1, 0, 1]]",
      explanation: "Distinct triplets summing to 0 are collected after sorting."
    }
  },
  "max-average-subarray-i": {
    statement: "You are given an integer array nums consisting of n elements, and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value.",
    example: {
      input: "nums = [1, 12, -5, -6, 50, 3], k = 4",
      output: "12.75",
      explanation: "Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75."
    }
  },
  "longest-substring-no-repeat": {
    statement: "Given a string s, find the length of the longest substring without repeating characters.",
    example: {
      input: 's = "abcabcbb"',
      output: "3",
      explanation: 'The answer is "abc", with a length of 3.'
    }
  },
  "min-size-subarray-sum": {
    statement: "Given an array of positive integers nums and a positive integer target, return the minimal length of a contiguous subarray [nums[l], ..., nums[r]] whose sum is greater than or equal to target. If there is no such subarray, return 0.",
    example: {
      input: "target = 7, nums = [2, 3, 1, 2, 4, 3]",
      output: "2",
      explanation: "The subarray [4, 3] has the minimal length under the problem constraint."
    }
  },
  "permutation-in-string": {
    statement: "Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise. In other words, return true if one of s1's permutations is the substring of s2.",
    example: {
      input: 's1 = "ab", s2 = "eidbaooo"',
      output: "true",
      explanation: 's2 contains one permutation of s1 ("ba").'
    }
  },
  "max-consecutive-ones-iii": {
    statement: "Given a binary array nums and an integer k, return the maximum number of consecutive 1's in the array if you can flip at most k 0's to 1's.",
    example: {
      input: "nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k = 2",
      output: "6",
      explanation: "Flipping two 0's yields 6 consecutive ones: [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1]."
    }
  },
  "fruit-into-baskets": {
    statement: "You are visiting a farm that has a single row of fruit trees. You have two baskets, and each basket can hold only one type of fruit. Return the maximum number of fruits you can pick in a contiguous stretch.",
    example: {
      input: "fruits = [1, 2, 3, 2, 2]",
      output: "4",
      explanation: "We can pick from trees [2, 3, 2, 2] since they only contain two fruit types (2 and 3)."
    }
  },
  "longest-repeating-char-replacement": {
    statement: "You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter.",
    example: {
      input: 's = "AABABBA", k = 1',
      output: "4",
      explanation: 'Replace the one \'A\' in the middle with \'B\' to form "AABBBBA", yielding substring "BBBB".'
    }
  },
  "subarrays-with-k-different-integers": {
    statement: "Given an integer array nums and an integer k, return the number of good subarrays of nums. A good array is an array where the number of different integers in that array is exactly k.",
    example: {
      input: "nums = [1, 2, 1, 2, 3], k = 2",
      output: "7",
      explanation: "Subarrays formed with exactly 2 distinct numbers: [1,2], [2,1], [1,2], [2,3], [1,2,1], [2,1,2], [1,2,1,2]."
    }
  },
  "minimum-window-substring": {
    statement: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string \"\".",
    example: {
      input: 's = "ADOBECODEBANC", t = "ABC"',
      output: '"BANC"',
      explanation: 'The minimum window substring "BANC" includes \'A\', \'B\', and \'C\' from string t.'
    }
  },
  "valid-parentheses": {
    statement: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
    example: {
      input: 's = "()[]{}"',
      output: "true",
      explanation: "All opened brackets are closed immediately by their matching partners."
    }
  },
  "min-stack": {
    statement: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time.",
    example: {
      input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()',
      output: 'getMin() -> -3, top() -> 0, getMin() -> -2',
      explanation: "Maintaining an auxiliary min-tracker keeps retrieval O(1)."
    }
  },
  "eval-reverse-polish": {
    statement: "You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation (postfix). Evaluate the expression and return an integer that represents the value of the expression.",
    example: {
      input: 'tokens = ["2", "1", "+", "3", "*"]',
      output: "9",
      explanation: "((2 + 1) * 3) = 9."
    }
  },
  "binary-search": {
    statement: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, return its index; otherwise, return -1 in O(log n) time.",
    example: {
      input: "nums = [-1, 0, 3, 5, 9, 12], target = 9",
      output: "4",
      explanation: "9 exists in nums and its index is 4."
    }
  },
  "search-rotated-array": {
    statement: "There is an integer array nums sorted in ascending order with distinct values, rotated at an unknown pivot index. Given target, return its index if found, or -1 otherwise in O(log n) runtime.",
    example: {
      input: "nums = [4, 5, 6, 7, 0, 1, 2], target = 0",
      output: "4",
      explanation: "Target 0 is found at index 4 in the rotated array."
    }
  },
  "find-min-rotated": {
    statement: "Given the sorted rotated array nums of unique elements, return the minimum element of this array in O(log n) time.",
    example: {
      input: "nums = [3, 4, 5, 1, 2]",
      output: "1",
      explanation: "The original array was [1, 2, 3, 4, 5] rotated 3 times. The minimum element is 1."
    }
  },
  "range-sum-query": {
    statement: "Given an integer array nums, handle multiple queries of calculating the sum of the elements of nums between indices left and right inclusive in O(1) per query using prefix sums.",
    example: {
      input: "nums = [-2, 0, 3, -5, 2, -1], sumRange(0, 2)",
      output: "1",
      explanation: "(-2) + 0 + 3 = 1."
    }
  },
  "subarray-sum-equals-k": {
    statement: "Given an array of integers nums and an integer k, return the total number of continuous subarrays whose sum equals to k.",
    example: {
      input: "nums = [1, 1, 1], k = 2",
      output: "2",
      explanation: "[nums[0], nums[1]] and [nums[1], nums[2]] each sum to 2."
    }
  },
  "reverse-linked-list": {
    statement: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
    example: {
      input: "head = [1, 2, 3, 4, 5]",
      output: "[5, 4, 3, 2, 1]",
      explanation: "Pointers are inverted iteratively so each node points to its previous node."
    }
  },
  "merge-two-sorted-lists": {
    statement: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list by splicing together the nodes of the first two lists.",
    example: {
      input: "list1 = [1, 2, 4], list2 = [1, 3, 4]",
      output: "[1, 1, 2, 3, 4, 4]",
      explanation: "The merged result preserves ascending sorted order across all nodes."
    }
  },
  "remove-nth-from-end": {
    statement: "Given the head of a linked list, remove the nth node from the end of the list and return its head in a single pass.",
    example: {
      input: "head = [1, 2, 3, 4, 5], n = 2",
      output: "[1, 2, 3, 5]",
      explanation: "The 2nd node from the end is 4. Removing it leaves [1, 2, 3, 5]."
    }
  },
  "linked-list-cycle": {
    statement: "Given head, the head of a linked list, determine if the linked list has a cycle in it using two pointers (Floyd's Tortoise and Hare algorithm).",
    example: {
      input: "head = [3, 2, 0, -4], pos = 1 (tail connects to node index 1)",
      output: "true",
      explanation: "There is a cycle in the linked list where tail connects to the second node."
    }
  },
  "middle-linked-list": {
    statement: "Given the head of a singly linked list, return the middle node of the linked list. If there are two middle nodes, return the second middle node.",
    example: {
      input: "head = [1, 2, 3, 4, 5]",
      output: "[3, 4, 5]",
      explanation: "The middle node of the list is node 3."
    }
  },
  "happy-number": {
    statement: "Write an algorithm to determine if a number n is happy. A happy number reaches 1 when replaced repeatedly by the sum of the squares of its digits.",
    example: {
      input: "n = 19",
      output: "true",
      explanation: "1² + 9² = 82 → 8² + 2² = 68 → 6² + 8² = 100 → 1² + 0² + 0² = 1."
    }
  },
  "invert-binary-tree": {
    statement: "Given the root of a binary tree, invert the tree (swap left and right subtrees recursively), and return its root.",
    example: {
      input: "root = [4, 2, 7, 1, 3, 6, 9]",
      output: "[4, 7, 2, 9, 6, 3, 1]",
      explanation: "Every left child becomes the right child, and vice versa."
    }
  },
  "max-depth-binary-tree": {
    statement: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    example: {
      input: "root = [3, 9, 20, null, null, 15, 7]",
      output: "3",
      explanation: "Longest branch is 3 -> 20 -> 15 (depth 3)."
    }
  },
  "diameter-binary-tree": {
    statement: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes in a tree, which may or may not pass through the root.",
    example: {
      input: "root = [1, 2, 3, 4, 5]",
      output: "3",
      explanation: "The longest path is [4, 2, 1, 3] or [5, 2, 1, 3], with length 3 edges."
    }
  },
  "level-order-traversal": {
    statement: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level) using a queue (BFS).",
    example: {
      input: "root = [3, 9, 20, null, null, 15, 7]",
      output: "[[3], [9, 20], [15, 7]]",
      explanation: "Level 0 has [3], Level 1 has [9, 20], Level 2 has [15, 7]."
    }
  },
  "right-side-view": {
    statement: "Given the root of a binary tree, imagine yourself standing on the right side of it, return the values of the nodes you can see ordered from top to bottom.",
    example: {
      input: "root = [1, 2, 3, null, 5, null, 4]",
      output: "[1, 3, 4]",
      explanation: "Looking from the right, node 1 is visible at level 0, 3 at level 1, and 4 at level 2."
    }
  },
  "validate-bst": {
    statement: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). All keys in a node's left subtree must be strictly less than the node, and right subtree strictly greater.",
    example: {
      input: "root = [2, 1, 3]",
      output: "true",
      explanation: "Left child 1 < 2, and right child 3 > 2."
    }
  },
  "kth-smallest-bst": {
    statement: "Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.",
    example: {
      input: "root = [3, 1, 4, null, 2], k = 1",
      output: "1",
      explanation: "In-order traversal visits [1, 2, 3, 4]; the 1st smallest is 1."
    }
  },
  "lca-bst": {
    statement: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q in the BST.",
    example: {
      input: "root = [6, 2, 8, 0, 4, 7, 9], p = 2, q = 8",
      output: "6",
      explanation: "The LCA of nodes 2 and 8 is 6 because 2 is in the left subtree and 8 is in the right subtree."
    }
  },
  "kth-largest": {
    statement: "Given an integer array nums and an integer k, return the kth largest element in the array using a Min-Heap of size k or QuickSelect.",
    example: {
      input: "nums = [3, 2, 1, 5, 6, 4], k = 2",
      output: "5",
      explanation: "The sorted array descending is [6, 5, 4, 3, 2, 1]. The 2nd largest element is 5."
    }
  },
  "last-stone-weight": {
    statement: "You are given an array of integers stones where stones[i] is the weight of the ith stone. Each turn, smash the two heaviest stones x and y (x <= y). If x != y, the new stone weight is y - x. Return the weight of the last remaining stone, or 0 if none remain.",
    example: {
      input: "stones = [2, 7, 4, 1, 8, 1]",
      output: "1",
      explanation: "Smashing 7 and 8 leaves 1 → smashing 2 and 4 leaves 2 → final stone weight is 1."
    }
  },
  "k-closest-points": {
    statement: "Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0) calculated by Euclidean distance.",
    example: {
      input: "points = [[1, 3], [-2, 2]], k = 1",
      output: "[[-2, 2]]",
      explanation: "Distance of (1, 3) is √10. Distance of (-2, 2) is √8. Since √8 < √10, [-2, 2] is closer."
    }
  },
  "fibonacci": {
    statement: "The Fibonacci numbers form a sequence where each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).",
    example: {
      input: "n = 4",
      output: "3",
      explanation: "F(4) = F(3) + F(2) = 2 + 1 = 3."
    }
  },
  "pow-x-n": {
    statement: "Implement pow(x, n), which calculates x raised to the power n (i.e., xⁿ) in O(log n) time using binary exponentiation.",
    example: {
      input: "x = 2.00000, n = 10",
      output: "1024.00000",
      explanation: "2¹⁰ = (2⁵)² = 1024."
    }
  },
  "climbing-stairs-recursion": {
    statement: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    example: {
      input: "n = 3",
      output: "3",
      explanation: "There are three ways: 1+1+1, 1+2, or 2+1."
    }
  },
  "subsets": {
    statement: "Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.",
    example: {
      input: "nums = [1, 2, 3]",
      output: "[[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]",
      explanation: "Every element has two choices: include or exclude."
    }
  },
  "combinations": {
    statement: "Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n].",
    example: {
      input: "n = 4, k = 2",
      output: "[[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]",
      explanation: "All pairs of size 2 chosen from 1 through 4."
    }
  },
  "permutations": {
    statement: "Given an array nums of distinct integers, return all the possible permutations in any order.",
    example: {
      input: "nums = [1, 2, 3]",
      output: "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]",
      explanation: "There are 3! = 6 distinct orderings."
    }
  },
  "number-of-islands": {
    statement: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is formed by connecting adjacent lands horizontally or vertically.",
    example: {
      input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
      output: "2",
      explanation: "Top-left forms one 4-connected land cluster; bottom-right forms a separate island."
    }
  },
  "clone-graph": {
    statement: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value and a list of its neighbors.",
    example: {
      input: "adjList = [[2, 4], [1, 3], [2, 4], [1, 3]]",
      output: "[[2, 4], [1, 3], [2, 4], [1, 3]]",
      explanation: "A complete clone with newly allocated Node objects and mirrored edges."
    }
  },
  "max-area-island": {
    statement: "You are given an m x n binary matrix grid. An island is a group of 1's connected 4-directionally. Return the maximum area of an island in grid. If there is no island, return 0.",
    example: {
      input: "grid = [[0, 0, 1, 0], [1, 1, 1, 0], [0, 1, 0, 0]]",
      output: "5",
      explanation: "The largest cluster of connected 1's has an area of 5 cells."
    }
  },
  "rotting-oranges": {
    statement: "You are given an m x n grid where 0 is an empty cell, 1 is a fresh orange, and 2 is a rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum minutes until no fresh orange remains, or -1.",
    example: {
      input: "grid = [[2, 1, 1], [1, 1, 0], [0, 1, 1]]",
      output: "4",
      explanation: "Multi-source BFS rots all fresh oranges after 4 minutes."
    }
  },
  "walls-and-gates": {
    statement: "You are given an m x n grid initialized with: -1 (wall), 0 (gate), INF (empty room). Fill each empty room with the distance to its nearest gate using multi-source BFS.",
    example: {
      input: "rooms = [[INF, -1, 0, INF], [INF, INF, INF, -1], [INF, -1, INF, -1], [0, -1, INF, INF]]",
      output: "[[3, -1, 0, 1], [2, 2, 1, -1], [1, -1, 2, -1], [0, -1, 3, 4]]",
      explanation: "Each room is filled with minimum steps to the nearest 0 gate."
    }
  },
  "course-schedule": {
    statement: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [a, b] indicates that you must take b before a. Return true if you can finish all courses (cycle detection in directed graph).",
    example: {
      input: "numCourses = 2, prerequisites = [[1, 0]]",
      output: "true",
      explanation: "To take course 1 you should take course 0. It is possible."
    }
  },
  "course-schedule-ii": {
    statement: "Return the ordering of courses you should take to finish all courses (topological sort). If there are many valid answers, return any of them. If it is impossible to finish all courses, return an empty array.",
    example: {
      input: "numCourses = 2, prerequisites = [[1, 0]]",
      output: "[0, 1]",
      explanation: "There are 2 courses to take. To take course 1 you should take course 0. So course order is [0, 1]."
    }
  },
  "connected-components": {
    statement: "You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph. Return the number of connected components.",
    example: {
      input: "n = 5, edges = [[0, 1], [1, 2], [3, 4]]",
      output: "2",
      explanation: "Component 1 is {0, 1, 2} and Component 2 is {3, 4}."
    }
  },
  "redundant-connection": {
    statement: "In an undirected graph that started as a tree with n nodes, one additional edge was added. Find an edge that can be removed so that the resulting graph is a tree of n nodes using Union-Find.",
    example: {
      input: "edges = [[1, 2], [1, 3], [2, 3]]",
      output: "[2, 3]",
      explanation: "[2, 3] creates the cycle and occurs last in the input."
    }
  },
  "climbing-stairs-dp": {
    statement: "Calculate distinct ways to climb n stairs where each step is 1 or 2 stairs using bottom-up dynamic programming in O(n) time and O(1) space.",
    example: {
      input: "n = 4",
      output: "5",
      explanation: "dp[4] = dp[3] + dp[2] = 3 + 2 = 5 ways."
    }
  },
  "house-robber": {
    statement: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, but adjacent houses have security systems that trigger if two adjacent houses are broken into. Return the maximum amount of money you can rob tonight without alerting the police.",
    example: {
      input: "nums = [1, 2, 3, 1]",
      output: "4",
      explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total = 1 + 3 = 4."
    }
  },
  "min-cost-climbing": {
    statement: "You are given an integer array cost where cost[i] is the cost of ith step on a staircase. Once you pay the cost, you can either climb one or two steps. Return the minimum cost to reach the top floor.",
    example: {
      input: "cost = [10, 15, 20]",
      output: "15",
      explanation: "You will start at index 1, pay 15, and climb two steps to reach the top."
    }
  },
  "house-robber-ii": {
    statement: "All houses at this place are arranged in a circle (the first house is adjacent to the last house). Compute the maximum amount of money you can rob without alerting police.",
    example: {
      input: "nums = [2, 3, 2]",
      output: "3",
      explanation: "You cannot rob house 1 (money = 2) and house 3 (money = 2), because they are adjacent neighbors in the circle."
    }
  },
  "delete-and-earn": {
    statement: "You are given an integer array nums. You want to maximize the number of points you get by performing the operation: take an element nums[i] and delete it, earning nums[i] points, but deleting all elements equal to nums[i] - 1 and nums[i] + 1.",
    example: {
      input: "nums = [3, 4, 2]",
      output: "6",
      explanation: "Delete 4 to earn 4 points. 3 is deleted. Then delete 2 to earn 2 points. Total 6."
    }
  },
  "coin-change": {
    statement: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount, or -1 if impossible.",
    example: {
      input: "coins = [1, 2, 5], amount = 11",
      output: "3",
      explanation: "11 = 5 + 5 + 1 (3 coins)."
    }
  },
  "target-sum": {
    statement: "You are given an integer array nums and an integer target. Build an expression out of nums by adding one of the symbols '+' and '-' before each integer and concatenate all integers. Return the number of different expressions that evaluate to target.",
    example: {
      input: "nums = [1, 1, 1, 1, 1], target = 3",
      output: "5",
      explanation: "There are 5 ways to assign symbols to make the sum of nums be target 3."
    }
  },
  "partition-equal-subset": {
    statement: "Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal.",
    example: {
      input: "nums = [1, 5, 11, 5]",
      output: "true",
      explanation: "The array can be partitioned as [1, 5, 5] and [11], both summing to 11."
    }
  },
  "unique-paths": {
    statement: "There is a robot on an m x n grid. The robot is initially located at the top-left corner and can only move either down or right at any point in time. Return the number of possible unique paths to the bottom-right corner.",
    example: {
      input: "m = 3, n = 7",
      output: "28",
      explanation: "Calculated via 2D dynamic programming grid paths dp[i][j] = dp[i-1][j] + dp[i][j-1]."
    }
  },
  "longest-common-subsequence": {
    statement: "Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.",
    example: {
      input: 'text1 = "abcde", text2 = "ace"',
      output: "3",
      explanation: 'The longest common subsequence is "ace" and its length is 3.'
    }
  },
  "buy-sell-cooldown": {
    statement: "You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve with unlimited transactions, but after you sell your stock, you cannot buy stock on the next day (cooldown of 1 day).",
    example: {
      input: "prices = [1, 2, 3, 0, 2]",
      output: "3",
      explanation: "transactions = [buy, sell, cooldown, buy, sell] profit = (2-1) + (2-0) = 3."
    }
  },
  "buy-sell-k-transactions": {
    statement: "You are given an integer k and an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve with at most k transactions.",
    example: {
      input: "k = 2, prices = [2, 4, 1]",
      output: "2",
      explanation: "Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4 - 2 = 2."
    }
  },
  "jump-game": {
    statement: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index.",
    example: {
      input: "nums = [2, 3, 1, 1, 4]",
      output: "true",
      explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index."
    }
  },
  "gas-station": {
    statement: "There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. Return the starting gas station's index if you can travel around the circuit once clockwise.",
    example: {
      input: "gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]",
      output: "3",
      explanation: "Start at station 3 (index 3) and fill with 4 unit of gas. Complete loop successfully."
    }
  },
  "partition-labels": {
    statement: "You are given a string s. We want to partition the string into as many parts as possible so that each letter appears in at most one part. Return a list of integers representing the size of these parts.",
    example: {
      input: 's = "ababcbacadefegdehijhklij"',
      output: "[9, 7, 8]",
      explanation: 'The partition is "ababcbaca", "defegde", "hijhklij". Each letter appears in at most one part.'
    }
  },
  "daily-temperatures": {
    statement: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0.",
    example: {
      input: "temperatures = [73, 74, 75, 71, 69, 72, 76, 73]",
      output: "[1, 1, 4, 2, 1, 1, 0, 0]",
      explanation: "Monotonic decreasing stack finds the next warmer day in O(n) total operations."
    }
  },
  "next-greater-element": {
    statement: "The next greater element of some element x in an array is the first greater element to its right in the same array. Given two arrays nums1 and nums2 where nums1 is a subset of nums2, find the next greater element for each value in nums1.",
    example: {
      input: "nums1 = [4, 1, 2], nums2 = [1, 3, 4, 2]",
      output: "[-1, 3, -1]",
      explanation: "For 4: no greater element -> -1. For 1: next greater is 3. For 2: no greater -> -1."
    }
  },
  "merge-intervals": {
    statement: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    example: {
      input: "intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]",
      output: "[[1, 6], [8, 10], [15, 18]]",
      explanation: "Intervals [1, 3] and [2, 6] overlap, merging into [1, 6]."
    }
  },
  "insert-interval": {
    statement: "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] sorted in ascending order by starti. You are also given an interval newInterval = [start, end]. Insert newInterval into intervals such that intervals is still sorted and non-overlapping.",
    example: {
      input: "intervals = [[1, 3], [6, 9]], newInterval = [2, 5]",
      output: "[[1, 5], [6, 9]]",
      explanation: "The new interval [2, 5] overlaps with [1, 3], producing [1, 5]."
    }
  },
  "implement-trie": {
    statement: "A trie (pronounced as \"try\") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class with insert, search, and startsWith methods in O(L) time.",
    example: {
      input: 'insert("apple"), search("apple"), search("app"), startsWith("app")',
      output: 'search("apple") -> true, search("app") -> false, startsWith("app") -> true',
      explanation: '"app" was not inserted as a complete word, but exists as a prefix.'
    }
  },
  "word-search-ii": {
    statement: "Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells (horizontally or vertically) without reusing a cell in the same word.",
    example: {
      input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]',
      output: '["eat", "oath"]',
      explanation: 'Using a Trie with backtracking checks all valid board paths simultaneously.'
    }
  },
  "single-number": {
    statement: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one in linear O(n) runtime and constant O(1) extra space using XOR.",
    example: {
      input: "nums = [4, 1, 2, 1, 2]",
      output: "4",
      explanation: "Since a ⊕ a = 0 and a ⊕ 0 = a, XORing all elements leaves the single value 4."
    }
  },
  "number-of-1-bits": {
    statement: "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (also known as the Hamming weight).",
    example: {
      input: "n = 11 (binary 1011)",
      output: "3",
      explanation: "The input binary string 1011 has a total of three set bits."
    }
  },
  "reverse-bits": {
    statement: "Reverse bits of a given 32 bits unsigned integer.",
    example: {
      input: "n = 00000010100101000001111010011100",
      output: "964176192 (00111001011110000010100101000000)",
      explanation: "All 32 bits are reversed from position 0 to 31."
    }
  },
  "happy-number-math": {
    statement: "Determine whether integer n is a happy number using set cycle detection or Floyd's cycle finding algorithm.",
    example: {
      input: "n = 19",
      output: "true",
      explanation: "The sequence of square digit sums converges to 1."
    }
  },
  "plus-one": {
    statement: "You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. Increment the large integer by one and return the resulting array of digits.",
    example: {
      input: "digits = [1, 2, 3]",
      output: "[1, 2, 4]",
      explanation: "The array represents the integer 123. Incrementing by one gives 124."
    }
  },
  "pow-x-n-math": {
    statement: "Calculate xⁿ for floating point x and integer n using binary exponentiation.",
    example: {
      input: "x = 2.10000, n = 3",
      output: "9.26100",
      explanation: "2.1 * 2.1 * 2.1 = 9.261."
    }
  },
  "merge-k-sorted": {
    statement: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it using a Min-Heap or Divide & Conquer in O(N log k) time.",
    example: {
      input: "lists = [[1, 4, 5], [1, 3, 4], [2, 6]]",
      output: "[1, 1, 2, 3, 4, 4, 5, 6]",
      explanation: "The linked-lists are merged together into one sorted sequence."
    }
  },
  "find-median-stream": {
    statement: "The median is the middle value in an ordered integer list. Design a data structure that supports adding numbers from a data stream and finding the median of the current numbers in O(log n) addition and O(1) retrieval using two heaps (max-heap for smaller half, min-heap for larger half).",
    example: {
      input: 'addNum(1), addNum(2), findMedian() -> 1.5, addNum(3), findMedian() -> 2.0',
      output: "1.5, 2.0",
      explanation: "The two heaps maintain balance so the median is always at the heap roots."
    }
  }
};

/**
 * Returns clean problem statement and example for a given problem object.
 */
export function getProblemDetails(problem) {
  if (!problem) {
    return {
      statement: "Internalize LeetCode algorithmic patterns and templates with rapid typing drills.",
      example: null
    };
  }

  // If the problem object itself carries statement/example, use it
  if (problem.statement || problem.description) {
    return {
      statement: problem.statement || problem.description,
      example: problem.example || null
    };
  }

  // Lookup in dictionary
  const details = problemDescriptions[problem.id];
  if (details) {
    return details;
  }

  // Fallback for custom drills
  const signalText = problem.signals && problem.signals.length > 0
    ? `Key pattern signals: "${problem.signals.join('", "')}".`
    : "";

  return {
    statement: `Solve ${problem.name} using the ${problem.pattern || "standard algorithmic"} pattern. ${signalText}`,
    example: null
  };
}
