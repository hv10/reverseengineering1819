from asciimatics.widgets import Frame, ListBox, Layout, Divider, Text, \
    Button, TextBox, Widget
from asciimatics.screen import Screen
from asciimatics.exceptions import ResizeScreenError, NextScene, StopApplication
from extract import *

class TUIView(Frame):
    def __init__(self, screen, model):
        super(TUIView, self).__init__(
            screen,
            screen.height * 2 //3,
            screen.width * 2 //3,
            hover_focus=True,
            title="WarExtractor"
        )
        layout2 = Layout([1, 1, 1, 1])
        self.add_layout(layout2)
        layout2.add_widget(Button("Add", self._add), 0)
        layout2.add_widget(self._edit_button, 1)
        layout2.add_widget(self._delete_button, 2)
        layout2.add_widget(Button("Quit", self._quit), 3)
        self.fix()
    
    @staticmethod
    def _quit():
        raise StopApplication("User pressed quit")

def main():
    while True:
        try:
            Screen.wrapper(TUIView, catch_interrupt=True)
            sys.exit(0)
        except:
            pass

if __name__ == '__main__':
    main()