CFLAGS = -O3 -std=c99 -Wall -Wshadow -Wvla -pedantic
LIBS = -lm
EXEC = main
HOME = ./
MODULES = ./modules/
FILESCOMPILE = $(MODULES)*
STARTINGPOINT = main

compile : clean
	tsc $(STARTINGPOINT)
	pkg $(STARTINGPOINT).js -o $(EXEC)

exec: compile
	./$(EXEC) ./testfile
	
install:
	 npm install

clean:
	/bin/rm -f $(MODULES)*.js $(MODULES)*.map *nfs
	/bin/rm -f $(HOME)*.js $(HOME)*.map
	/bin/rm -f $(HOME)$(EXEC)
