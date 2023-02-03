CFLAGS = -O3 -std=c99 -Wall -Wshadow -Wvla -pedantic
LIBS = -lm
EXEC = run
HOME = ./
MODULES = ./modules/
FILESCOMPILE = $(MODULES)*
STARTINGPOINT = $(MODULES)index

compile : clean
	tsc $(FILESCOMPILE)
	pkg $(STARTINGPOINT).js -o $(EXEC)

exec: compile
	./$(EXEC)
	
checkMem: $(EXEC)
	valgrind --leak-check=full --show-leak-kinds=all -v --track-origins=yes ./$(EXEC) $(TESTDIR)500_500.b $(OUTDIR)500_500.t $(OUTDIR)500_500.f $(OUTDIR)500_500.p

install:
	 npm install

clean:
	/bin/rm -f $(MODULES)*.js *nfs
	/bin/rm -f $(HOME)*.js *nfs
	/bin/rm -f $(HOME)*.map *nfs
	/bin/rm -f $(HOME)$(EXEC) *nfs
