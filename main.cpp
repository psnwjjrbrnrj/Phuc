#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::vector<int> nums = {42, 7, 19, 88, 3};
    std::sort(nums.begin(), nums.end());
    std::cout << "3012 Zero-Config C++20 Sorted: ";
    for (int n : nums) std::cout << n << " ";
    std::cout << "\n";
    return 0;
}