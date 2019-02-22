import unittest
from functools import wraps


def score_with(score):
    def decorator(fn):
        def decorated(*args,**kwargs):
            ret = fn(*args,**kwargs) 
            if ret:
                args[0].__class__._increase_score(score)
            return ret
        return decorated
    return decorator

class Prover():
    """
    Inherit from me to score a testing scenario.

    Decorate a test_case with "@score_with(amount)" to track
    the points generated!
    All functions with "test" in the beginning of the signature 
    will be evaluated upon calling .run() of the instance.

    A child-class should only track points for a _single_ scenario!
    """
    def __init__(self,*args,**kwargs):
        self.__class__.score = 0
    
    @classmethod
    def _increase_score(cls,scr):
        cls.score += scr
    
    def run(self, *args,**kwargs):
        public_method_names = [
            method for method in dir(self) 
            if callable(getattr(self, method)) 
            if method.startswith('test')
        ]  # 'private' methods start from _
        for method in public_method_names:
            print(method)
            getattr(self, method)()
        print("Points reached: ",self.__class__.score)
        return self.score


if __name__=="__main__":
    Prover()
