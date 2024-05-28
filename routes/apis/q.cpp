#include <iostream>
#include <vector>
#include <algorithm>
#include <limits>
#include <cmath>

using namespace std;

// Function to calculate the File Extracting Time (FET)
double calculateFET(vector<int>& permutation) {
    double sum = 0;
    double n = permutation.size();
    for (int i = 0; i < n; ++i) {
        for (int j = 0; j <= i; ++j) {
            sum += permutation[j];
        }
    }
    return sum / n;
}

// Function to generate all permutations and find the minimum FET
pair<vector<int>, int> DiskStorage(int* mat, int n) {
    if (n == 0) {
        return make_pair(vector<int>{-1}, 0);
    }

    vector<int> files(mat, mat + n);
    sort(files.begin(), files.end()); // Sorting files to consider permutations in increasing order
    vector<int> bestPermutation;
    double minFET = numeric_limits<double>::max();

    do {
        double fet = calculateFET(files);
        if (fet < minFET) {
            minFET = fet;
            bestPermutation = files;
        }
    } while (next_permutation(files.begin(), files.end()));

    int roundedFET = static_cast<int>(round(minFET)); // Round FET to the nearest integer
    return make_pair(bestPermutation, roundedFET);
}

int main() {
    int n = 8;
    int mat[] = {99, 34, 53, 11, 65, 46, 123, 26};

    pair<vector<int>, int> result = DiskStorage(mat, n);

    cout << "Output: ";
    for (int i : result.first) {
        cout << i << " ";
    }
    cout << endl;
    
    cout << "FET time: " << result.second << endl;

    return 0;
}
