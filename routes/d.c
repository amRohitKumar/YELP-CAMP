#include<stdio.h>
#include<stdlib.h>
#include<ctype.h>
#include<string.h>
#define MAX 100

int main(){
    // int i = 0, j;
    int i = -1, j = 1, k = -1;
    if(++k, j, i++){
        printf("%d %d %d", i,j,k);
    }
    printf("%d", NULL);
    return 0;
}